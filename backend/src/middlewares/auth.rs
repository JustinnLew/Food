use std::sync::Arc;

use axum::{
    extract::{Request, State},
    http::StatusCode,
    middleware::Next,
    response::{IntoResponse, Response},
};
use jsonwebtoken::{Algorithm, DecodingKey, Validation, decode, decode_header};
use serde::Deserialize;

use crate::AppState;

#[derive(Deserialize, Clone, Debug)]
struct Claims {
    sub: String,
}

pub async fn auth_guard(
    State(state): State<Arc<AppState>>,
    mut req: Request,
    next: Next,
) -> Response {
    let token_str = req
        .headers()
        .get("Authorization")
        .and_then(|header| header.to_str().ok())
        .and_then(|header| header.strip_prefix("Bearer "));

    let token = match token_str {
        Some(t) => t,
        None => return (StatusCode::UNAUTHORIZED, "Missing or invalid token").into_response(),
    };

    let header = match decode_header(token) {
        Ok(h) => h,
        Err(_) => return (StatusCode::BAD_REQUEST, "Invalid token header").into_response(),
    };
    let kid = match header.kid {
        Some(k) => k,
        None => return (StatusCode::UNAUTHORIZED, "Invalid token header").into_response(),
    };

    // TODO: Implement refreshing JWKS cache if kid is not found
    let jwk = match state.jwks.find(&kid) {
        Some(j) => j,
        None => return (StatusCode::UNAUTHORIZED, "JWK not found for token").into_response(),
    };

    let mut validation = Validation::new(Algorithm::ES256);
    validation.set_audience(&["authenticated"]);
    validation.set_issuer(&[format!("https://{}.supabase.co/auth/v1", std::env::var("PROJECT_REF").expect("PROJECT_REF must be set"))]);
    let decoding_key = match DecodingKey::from_jwk(jwk) {
        Ok(key) => key,
        Err(_) => {
            return (StatusCode::INTERNAL_SERVER_ERROR, "Failed to decode JWK").into_response();
        }
    };

    match decode::<Claims>(token, &decoding_key, &validation) {
        Ok(token) => {
            println!("Request from {:?}", token.claims.sub);
            req.extensions_mut().insert(token.claims);
            let response = next.run(req).await;
            return response;
        }
        Err(_) => {
            return (StatusCode::UNAUTHORIZED, "Invalid token").into_response();
        }
    }
}
