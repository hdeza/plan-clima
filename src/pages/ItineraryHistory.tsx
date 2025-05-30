"use client"

import Footer from "@/layouts/Footer"
import Header from "@/layouts/Header"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  type SnackbarCloseReason,
  TextField,
  Typography,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import DeleteIcon from "@mui/icons-material/Delete"
import { AuthContext } from "@/contexts/AuthProvider"
import EditIcon from "@mui/icons-material/Edit"
import { useNavigate } from "react-router-dom"
import type { Itinerary } from "@/interfaces/Itinerary"
import type { Activity } from "@/interfaces/activity"
import { itineraryService } from "@/services/itineraryService"
import { useActivityService } from "@/services/activityService"

export const ItineraryHistory = () => {
  const navigate = useNavigate()

  const [expanded, setExpanded] = React.useState<string | false>(false)
  const [alertMessage, setAlertMessage] = React.useState<string>("")
  const [open, setOpen] = React.useState(false)
  const [itineraries, setItineraries] = React.useState<Itinerary[]>([])
  const [openEdit, setOpenEdit] = React.useState<number | null>(null)
  const [editValues, setEditValues] = useState<{ [key: number]: Partial<Activity> }>({})
  const authContext = React.useContext(AuthContext)

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  const getItineraries = async () => {
    try {
      const response = await itineraryService(authContext).getItineraries()
      // Map response to match the Itinerary type
      const mappedItineraries: Itinerary[] = response.map((item: any) => ({
        id: item.id,
        city: item.city,
        firebase_uid: item.firebase_uid ?? "", // Provide default if missing
        creation_date: item.creation_date,
        predicted_temperature: item.predicted_temperature,
        state: item.state,
        activities: item.activities ?? [], // Provide default if missing
      }))
      setItineraries(mappedItineraries)
      console.log("Itineraries fetched successfully:", mappedItineraries)
    } catch (error) {
      console.error("Error fetching itineraries:", error)
      setAlertMessage("Failed to fetch itineraries. Please try again.")
      setOpen(true)
    }
  }

  const handleDeleteActivity = async(activityId: number) => {
    // Implement the logic to delete the activity from the itinerary
    try{
      await useActivityService(authContext).deleteActivity(activityId);
      setAlertMessage(`Activity ${activityId} deleted successfully`);
      setOpen(true)
      setTimeout(() => {
        setOpen(false);
        setAlertMessage("");
        getItineraries(); // Refresh the itineraries after deletion
      }, 3000) // Clear alert after 3 seconds
    } catch (error) {
      console.error("Error deleting activity:", error);
      setAlertMessage("Failed to delete activity. Please try again.");
      setOpen(true)
      setTimeout(() => {
        setOpen(false);
        setAlertMessage("");
        getItineraries(); // Refresh the itineraries after deletion
      }, 3000)
    }

  }

  const handleEditActivity = async (activity: Activity) => {
    try {
      const updatedActivity = {
        hour: editValues[activity.id]?.hour ?? activity.hour,
        description: editValues[activity.id]?.description ?? activity.description,
        state: editValues[activity.id]?.state ?? activity.state,
      }
      await useActivityService(authContext).updateActivity(activity.id, updatedActivity)
      setAlertMessage(`Activity ${activity.id} updated successfully`)
      setOpen(true)
      setOpenEdit(null)
      setEditValues((prev) => {
        const newVals = { ...prev }
        delete newVals[activity.id]
        return newVals
      })
      setTimeout(() => {
        setOpen(false)
        setAlertMessage("")
        getItineraries()
      }, 3000)
    } catch (error) {
      console.error("Error updating activity:", error)
      setAlertMessage("Failed to update activity. Please try again.")
      setOpen(true)
      setTimeout(() => {
        setOpen(false)
        setAlertMessage("")
        getItineraries()
      }, 3000)
    }
  }

  // Here we are going to implement the reder of the view when a activity is deleted or edited
  useEffect(() => {
    // Fetch itineraries when the component mounts
    const fetchItineraries = async () => {
      try {
        await getItineraries()
      } catch (error) {
        console.error("Error fetching itineraries:", error)
        setAlertMessage("Failed to fetch itineraries. Please try again.")
        setOpen(true)
      }
    }

    fetchItineraries()
  }, [])

  const handleLogout = async () => {
    if (authContext && authContext.user) {
      await authContext.logout()
      setAlertMessage("Logout successful")
      setOpen(true)
      setTimeout(() => {
        setOpen(false)
        setAlertMessage("")
      }, 3000) // Clear alert after 3 seconds

      navigate("/login")
      // window.location.href = "/login";
    } else {
      setOpen(true)
      setAlertMessage("Logout failed. Please try again.")
      console.error("AuthContext or logout function is not available.")
    }
  }



  const handleClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return
    }

    setOpen(false)
  }

  return (
    <>
      <Header isInHome={false} />
      <div className="flex justify-center min-h-svh bg-cover bg-center bg-[url('src/assets/buritaca.jpg')]">
        <div className="w-full max-w-4xl px-4 mx-auto my-16 md:px-6">
          <div className="flex items-center justify-between my-8">
            <h2 className="font-serif text-4xl font-bold text-white">ITINERATY HISTORY</h2>
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
                      {(() => {
                        // Si es Date, formatea a yyyy-mm-dd, si no, intenta parsear y formatear igual
                        let dateObj: Date;
                        if (itinerary.creation_date instanceof Date) {
                          dateObj = itinerary.creation_date;
                        } else {
                          dateObj = new Date(itinerary.creation_date);
                        }
                        // Formato yyyy-mm-dd
                        const yyyy = dateObj.getFullYear();
                        const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
                        const dd = String(dateObj.getDate()).padStart(2, "0");
                        return `${yyyy}-${mm}-${dd}`;
                      })()}
                    </span>

                    <Typography>
                      <span>
                        Predicted temperature: {itinerary.predicted_temperature}
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
                                  setOpenEdit(activity.id || null)
                                  setEditValues((prev) => ({
                                    ...prev,
                                    [activity.id]: {
                                      hour: activity.hour,
                                      description: activity.description,
                                      state: activity.state,
                                    },
                                  }))
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton aria-label="delete" onClick={() => handleDeleteActivity(activity.id)}>
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
                        {activity.id && openEdit === activity.id && (
                          <div className="grid grid-cols-2 gap-4 bg-white/70 p-4 rounded-lg mb-4">
                            <TextField
                              id="filled-hour"
                              label="Hour"
                              variant="filled"
                              value={editValues[activity.id]?.hour ?? ""}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [activity.id]: {
                                    ...prev[activity.id],
                                    hour: e.target.value,
                                  },
                                }))
                              }
                            />
                            <TextField
                              id="filled-description"
                              label="Description"
                              variant="filled"
                              value={editValues[activity.id]?.description ?? ""}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [activity.id]: {
                                    ...prev[activity.id],
                                    description: e.target.value,
                                  },
                                }))
                              }
                            />
                            <TextField
                              id="filled-status"
                              label="Status"
                              variant="filled"
                              value={editValues[activity.id]?.state ?? ""}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [activity.id]: {
                                    ...prev[activity.id],
                                    state: e.target.value,
                                  },
                                }))
                              }
                            />
                            <br />
                            <div>
                              <button
                                onClick={() => handleEditActivity(activity)}
                                className="col-start-1 text-cyan-50 bg-orange-500 py-2 rounded-md w-32 h-full mx-2"
                              >
                                Update activity
                              </button>
                              <button
                                className="text-cyan-50 bg-gray-400 py-2 rounded-md w-32 h-full mx-2"
                                onClick={() => {
                                  setOpenEdit(null)
                                  setEditValues((prev) => {
                                    const newVals = { ...prev }
                                    delete newVals[activity.id]
                                    return newVals
                                  })
                                }}
                              >
                                Cancel
                              </button>
                            </div>
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
          <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: "100%" }}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </div>
      <Footer />
    </>
  )
}
