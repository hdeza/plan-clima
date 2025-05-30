import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Snackbar,
  SnackbarCloseReason,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "@/contexts/AuthProvider";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { Itinerary } from "@/interfaces/Itinerary";
import { Activity } from "@/interfaces/activity";
import { itineraryService } from "@/services/itineraryService";

export const ItineraryHistory = () => {
  const navigate = useNavigate();

  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [alertMessage, setAlertMessage] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [itineraries, setItineraries] = React.useState<Itinerary[]>([]);
  const [openEdit, setOpenEdit] = React.useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  const authContext = React.useContext(AuthContext);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const getItineraries = async () => {
    try {
      const response = await itineraryService(authContext).getItineraries();
      setItineraries(response);
      console.log("Itineraries fetched successfully:", response);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      setAlertMessage("Failed to fetch itineraries. Please try again.");
      setOpen(true);
    }
  };

  const handleDeleteActivity = (activity: Activity) => {
    // Implement the logic to delete the activity from the itinerary
    console.log(`Deleting activity ${activity.id}`);
  };

  const handleEditActivity = (activity: Activity) => {
    // Implement the logic to edit the activity in the itinerary
    console.log(`Editing activity ${activity.id}`);
    // Open a modal to edit the activity
  };

  // Here we are going to implement the reder of the view when a activity is deleted or edited
  useEffect(() => {
    // Fetch itineraries when the component mounts
    const fetchItineraries = async () => {
      try {
        await getItineraries();
      } catch (error) {
        console.error("Error fetching itineraries:", error);
        setAlertMessage("Failed to fetch itineraries. Please try again.");
        setOpen(true);
      }
    };

    fetchItineraries();
  }, []);

  const handleLogout = async () => {
    if (authContext && authContext.user) {
      await authContext.logout();
      setAlertMessage("Logout successful");
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        setAlertMessage("");
      }, 3000); // Clear alert after 3 seconds

      navigate("/login");
      // window.location.href = "/login";
    } else {
      setOpen(true);
      setAlertMessage("Logout failed. Please try again.");
      console.error("AuthContext or logout function is not available.");
    }
  };

  const itineraryTest = [
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
  ];

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
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
                  expanded={expanded === String(itinerary.id)}
                  onChange={handleChange(String(itinerary.id))}
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
                    <span>
                    {itinerary.city} -{" "}
                    {itinerary.creation_date instanceof Date
                      ? itinerary.creation_date.toLocaleDateString()
                      : itinerary.creation_date}
                    </span>

                    <Typography>
                    <span>
                      Predicted temperature:{" "}
                      {itinerary.predicted_temperature}
                      °C
                    </span>

                    <br />
                    <span>Status: {itinerary.state}</span>
                    </Typography>
                  </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    borderTop: "1px solid rgba(255, 255, 255, 0.25)",
                    padding: "16px",
                  }}
                  >
                  <List>
                    {itinerary.activities.map((activity) => (
                    <React.Fragment key={activity.id}>
                      <ListItem
                      disableGutters
                      secondaryAction={
                        <span>
                        <IconButton
                          aria-label="edit"
                          onClick={() => {
                          setOpenEdit(activity.id ? true : false);
                          }}
                        >
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
                          <span>Activity {activity.id}</span>
                          <br />
                          <span>{activity.description}</span>
                          <br />
                          <span>Status: {activity.state}</span>
                          <br />
                          <span>Hour: {activity.hour}</span>
                        </>
                        }
                      />
                      </ListItem>
                      {openEdit  && (
                      <div className="grid grid-cols-2 gap-4 bg-white/70 p-4 rounded-lg mb-4">
                        <TextField id="filled-hour" label="Hour" variant="filled" defaultValue={activity.hour} />
                        <TextField
                        id="filled-description"
                        label="Description"
                        variant="filled"
                        defaultValue={activity.description}
                        />
                        <TextField
                        id="filled-status"
                        label="Status"
                        variant="filled"
                        defaultValue={activity.state}
                        />
                        <br />
                        <button className="col-start-1 col-end-2 text-cyan-50 bg-orange-500 py-2 rounded-md w-1/2 h-full">
                        Update activity
                        </button>
                        <button
                        className="text-cyan-50 bg-gray-400 py-2 rounded-md w-1/2 h-full"
                        onClick={() => setOpenEdit(false)}
                        >
                        Cancel
                        </button>
                      </div>
                      )}
                    </React.Fragment>
                    ))}
                  </List>
                  </AccordionDetails>
                </Accordion>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </div>
      <Footer />
    </>
  );
};
