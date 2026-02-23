import NavBarLanding from "../components/NavBarLanding";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-gray-100">
      <NavBarLanding />
      <div className="flex flex-col m-6 h-full">

      <Accordion className="w-full p-1">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={"pantry-content"}
          id={"pantry-header"}
          >
          <h1 className="text-xl font-bold">T</h1>
        </AccordionSummary>
        <AccordionDetails className="flex flex-col gap-2">
          <label htmlFor="ingredient search" className="block text-sm font-medium text-gray-700 mb-2">Search for an ingredient:</label>
          <input type="text" placeholder="Ingredient Name" className="border p-2 rounded w-full mb-4"/>
          <div className="border-1 border-gray-300 mb-4"/>

          <div className="grid grid-cols-3 gap-4">
            {/* Insert ingredient card here */}
            <div className="flex border-1 border-gray-300 rounded-lg p-3 flex-col">
              <h1>Tomato</h1>
              <p>2 Whole</p>
            </div>
            <div className="flex border-1 border-gray-300 rounded-lg p-3">
              <h1 className="flex-1">Potato</h1>
              <p>2</p>
            </div>
            <div className="flex border-1 border-gray-300 rounded-lg p-3">
              <h1 className="flex-1">Banana</h1>
              <p>2</p>
            </div>
            <div className="flex border-1 border-gray-300 rounded-lg p-3">
              <h1 className="flex-1">Beef Mince</h1>
              <p>2</p>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
      <div className="flex flex-col gap-4 mt-4 border-1 border-gray-300 rounded-lg p-3">
        <h1 className="text-xl font-bold">Recommendations</h1>
        <div className="flex gap-6 h-64">
          <div className="flex-1 flex-col border-1 border-gray-300 rounded-md p-3">

          </div>
          <div className="flex-1 flex-col border-1 border-gray-300 rounded-md p-3">

          </div>
          <div className="flex-1 flex-col border-1 border-gray-300 rounded-md p-3">

          </div>
        </div>
        <div className="self-center">RR</div>
      </div>
      </div>
    </div>
  );
}
