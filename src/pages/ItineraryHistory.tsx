import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const ItineraryHistory = () => {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const itineraries = [
    { id: "panel8", title: "ITINERARIO 8" },
    { id: "panel7", title: "ITINERARIO 7" },
    { id: "panel6", title: "ITINERARIO 6" },
    { id: "panel5", title: "ITINERARIO 5" },
    { id: "panel4", title: "ITINERARIO 4" },
    { id: "panel3", title: "ITINERARIO 3" },
    { id: "panel2", title: "ITINERARIO 2" },
    { id: "panel1", title: "ITINERARIO 1" },
  ];

  return (
    <>
      <Header isInHome={false} />
      <div className="flex justify-center min-h-svh bg-cover bg-center bg-[url('src/assets/buritaca.jpg')]">
        <div className="w-full max-w-4xl px-4 mx-auto my-16 md:px-6">
          <div className="flex items-center justify-between my-8">
            <h2 className="font-serif text-4xl font-bold text-white">
              ITINERATY HISTORY
            </h2>
            <button className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600">
              Cerrar sesión
            </button>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {itineraries.map((itinerary) => (
              <Accordion
                key={itinerary.id}
                expanded={expanded === itinerary.id}
                onChange={handleChange(itinerary.id)}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(8px)",
                  border: "2px solid rgba(255, 255, 255, 0.25)",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  "& .MuiAccordionSummary-root": {
                    minHeight: "64px",
                  },
                  "& .MuiAccordionSummary-content": {
                    margin: "12px 0",
                  },
                  "&:before": {
                    display: "none",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                  aria-controls={`${itinerary.id}-content`}
                  id={`${itinerary.id}-header`}
                  sx={{
                    "& .MuiAccordionSummary-expandIconWrapper": {
                      color: "white",
                    },
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontFamily: "serif",
                      fontWeight: "bold",
                      fontSize: "1.25rem",
                      color: "white",
                    }}
                  >
                    {itinerary.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    borderTop: "1px solid rgba(255, 255, 255, 0.25)",
                    padding: "16px",
                  }}
                >
                  <Typography sx={{ color: "white" }}>
                    Detalles del itinerario: fecha, destino, actividades.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
