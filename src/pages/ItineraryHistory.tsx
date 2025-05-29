import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "@/contexts/AuthProvider";
import EditIcon from '@mui/icons-material/Edit';

interface Activity {
  id: number;
  hour: string;
  description: string;
  state: string;
}

interface Itinerary {
  id: string;
  city: string;
  creation_date: string;
  predicted_temperature: string;
  state: string;
  activities: Activity[];
}


export const ItineraryHistory = () => {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const authContext = React.useContext(AuthContext);

  const handleChange =(panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
  };

  
  const getItineraries = (itinerary: Itinerary) => {
    // Implement the logic to fetch itineraries from the server or state
    console.log(`Fetching itineraries for ${itinerary.city}`);
    // This is where you would typically make an API call to get the itineraries
  }
    
  
  const handleDeleteActivity = (itinerary: Itinerary ,activity: Activity) => {
    // Implement the logic to delete the activity from the itinerary
    console.log(`Deleting activity ${activity.id} from itinerary ${itinerary.id}`);
    // You might want to update the state or make an API call here
  }

  const handleEditActivity = (itinerary: Itinerary, activity: Activity) => {
    // Implement the logic to edit the activity in the itinerary
    console.log(`Editing activity ${activity.id} in itinerary ${itinerary.id}`);
    // Open a modal to edit the activity
  }

  // Here we are going to implement the reder of the view when a activity is deleted or edited
  useEffect(() => {}, []);



  const itineraries = [
    {
      id: "1",
      city: "Cartagena",
      creation_date: "2023-10-01",
      predicted_temperature: "30°C",
      state: "Completed",
      activities: [
        {
          id: 2,
          hour: "10:00",
          description: "Visita al Castillo San Felipe",
          state: "Completed",
        },
        {
          id: 3,
          hour: "12:00",
          description: "Almuerzo en restaurante local",
          state: "Completed",
        },
        {
          id: 4,
          hour: "14:00",
          description: "Paseo por la ciudad amurallada",
          state: "Completed",
        },
      ],
    },
    {
      id: "2",
      city: "Leticia",
      creation_date: "2023-09-15",
      predicted_temperature: "28°C",
      state: "Completed",
      activities: [
        {
          id: 3,
          hour: "10:00",
          description: "Visita al Parque Nacional Natural Amacayacu",
          state: "Completed",
        },
        {
          id: 4,
          hour: "12:00",
          description: "Almuerzo en restaurante local",
          state: "Completed",
        },
      ],
    },
    {
      id: "3",
      city: "Santa Marta",
      creation_date: "2023-08-20",
      predicted_temperature: "26°C",
      state: "Completed",
      activities: [
        {
          id: 4,
          hour: "10:00",
          description: "Visita al Parque Tayrona",
          state: "Completed",
        },
        {
          id: 5,
          hour: "12:00",
          description: "Almuerzo en restaurante local",
          state: "Completed",
        },
      ],
    },
    {
      id: "4",
      city: "Medellin",
      creation_date: "2023-07-10",
      predicted_temperature: "27°C",
      state: "Completed",
      activities: [
        {
          id: 5,
          hour: "10:00",
          description: "Visita al Parque Arví",
          state: "Completed",
        },
        {
          id: 6,
          hour: "12:00",
          description: "Almuerzo en restaurante local",
          state: "Completed",
        },
      ],
    },
    {
      id: "5",
      city: "Monteria",
      creation_date: "2023-06-05",
      predicted_temperature: "25°C",
      state: "Completed",
      activities: [
        {
          id: 6,
          hour: "10:00",
          description: "Visita al Parque Ronda del Sinú",
          state: "Completed",
        },
        {
          id: 7,
          hour: "12:00",
          description: "Almuerzo en restaurante local",
          state: "Completed",
        },
      ],
    },
  ];

  const handleLogout = async () => {
    if (authContext && authContext.user) {
      await authContext.logout();
    } else {
      console.error("AuthContext or logout function is not available.");
    }
  };

  return (
    <>
      <Header isInHome={false} />
      <div className="flex justify-center min-h-svh bg-cover bg-center bg-[url('src/assets/buritaca.jpg')]">
        <div className="w-full max-w-4xl px-4 mx-auto my-16 md:px-6">
          <div className="flex items-center justify-between my-8">
            <h2 className="font-serif text-4xl font-bold text-white">
              ITINERATY HISTORY
            </h2>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600 "
            >
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
                    {itinerary.city} - {itinerary.creation_date}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    borderTop: "1px solid rgba(255, 255, 255, 0.25)",
                    padding: "16px",
                  }}
                >
                  <List
                    
                  >
                    {itinerary.activities.map((activity) => (
                      <ListItem
                        key={activity.id}
                        disableGutters
                        secondaryAction={
                          <span>
                            <IconButton aria-label="edit">
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton aria-label="comment">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </span>
                        }
                      >
                        <ListItemText
                          primary={
                            <>
                              <span>Actividad {activity.id}</span>
                              <br />
                              <span>{activity.description}</span>
                              <br />
                              <span>Estado: {activity.state}</span>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
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
