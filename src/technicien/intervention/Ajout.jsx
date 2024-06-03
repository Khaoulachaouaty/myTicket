import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  useTheme,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useForm } from "react-hook-form";
import { ConfirmationNumberOutlined, Done, Margin } from "@mui/icons-material";
import Header from "../../admin/components/Header";
import { typeInterService } from "../../services/typeInter_service";
import { useLocation } from "react-router-dom";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import ReplayIcon from "@mui/icons-material/Replay";
import { causeService } from "../../services/cause_service";
import { interventionService } from "../../services/intervention_service";
import { ticketService } from "../../services/ticke_servicet";
import { useNavigate } from "react-router-dom";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const AjoutIntervention = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ticketDataString = searchParams.get("ticketData");
  const ticketData = JSON.parse(ticketDataString);

  const theme = useTheme();
  let navigate = useNavigate();

  const [dateRealisation, setDateRealisaton] = useState(null);
  const [descriptionPanne, setDescriptionPanne] = useState(
    ticketData.intervention.descriptionPanne
  );
  const [dureeRealisation, setDureeRealisation] = useState(0);
  const [compteRendue, setCompteRendue] = useState(
    ticketData.intervention.compteRendu
  );
  const [interObservation, setInterObservaton] = useState(
    ticketData.intervention.interventionObservation
  );
  const [interHebergement, setInterHebergement] = useState(
    ticketData.intervention.interMtHebergement
  );
  const [interDeplacement, setInterDeplacement] = useState(
    ticketData.intervention.interMtDeplacement
  );
  const [dateCloture, setDateCloture] = useState(null);
  const [type, setType] = useState(ticketData.intervention.interventionType);
  const [types, setTypes] = useState([]);
  const [cause, setCause] = useState(ticketData.intervention.cause);
  const [causes, setCauses] = useState([]);

  const loadTypes = async () => {
    try {
      const response = await typeInterService.getAllTypeInter();
      setTypes(response.data);
      console.log("type", response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  console.log(dureeRealisation);

  const loadCauses = async () => {
    try {
      const response = await causeService.getAllCauses();
      setCauses(response.data);
      console.log("type", response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  useEffect(() => {
    loadTypes();
    loadCauses();
  }, []);

  const handleSaveDialog = () => {
    if (!ticketData.intervention.dateRealisation) {
      setDateRealisaton(new Date());
    }

    const intervention = {
      idIntervention: ticketData.intervention.idIntervention,
      dateCloture: dateCloture,
      descriptionPanne: descriptionPanne,
      dtRealisation: dateRealisation,
      dureeRealisation: dureeRealisation,
      compteRendu: compteRendue,
      interventionObservation: interObservation,
      interMtDeplacement: interDeplacement,
      interMtHebergement: interHebergement,
      interventionType: type,
      cause: cause,
    };

    console.log("avant l'ajout", intervention);

    interventionService
      .updateIntervention(intervention)
      .then(() => {
        if (isInterventionCompleted) {
          ticketService
            .updateTicketStatut(ticketData.interCode, "Réalisé") // Passer le nouvel état comme deuxième argument
            .then((ticketResponse) => {
              console.log(ticketResponse);
              navigate("/technicien/intervention");
              reset(); // Réinitialiser le formulaire
            })
            .catch((error) => {
              console.error("Error fetching ticket data:", error);
            });
        } else {
          navigate("/technicien/intervention");
          reset(); // Réinitialiser le formulaire
        }
      })
      .catch((error) => {
        console.error("Error updating intervention:", error);
      });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const datePrevueString = ticketData.datePrevue ? ticketData.datePrevue : "";
  const datePrevue = new Date(
    datePrevueString.replace("T", " ").replace(/\..+/, "")
  ); // Convertir la chaîne de caractères en objet Date
  const formattedDateT = `${datePrevue
    .getDate()
    .toString()
    .padStart(2, "0")}/${(datePrevue.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${datePrevue.getFullYear()} ${datePrevue
    .getHours()
    .toString()
    .padStart(2, "0")}:${datePrevue.getMinutes().toString().padStart(2, "0")}`;
  console.log(formattedDateT);

  const dateCreationString = ticketData.dateCreation; // Exemple de chaîne de caractères représentant la date
  const dateCreation = new Date(
    dateCreationString.replace("T", " ").replace(/\..+/, "")
  ); // Convertir la chaîne de caractères en objet Date

  const formattedDate = `${dateCreation
    .getDate()
    .toString()
    .padStart(2, "0")}/${(dateCreation.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${dateCreation.getFullYear()}`;
  console.log(formattedDate);

  // Code pour la gestion du chronomètre
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(
    ticketData.intervention.dureeRealisation
  );

  // Ajoutez un nouvel état pour stocker le temps écoulé lorsque le chronomètre est en pause
  const [savedElapsedTime, setSavedElapsedTime] = useState(0);

  const toggleTimer = () => {
    if (isRunning) {
      // Arrêter le chronomètre
      setIsRunning(false);
      // Sauvegarder le temps écoulé dans savedElapsedTime
      setSavedElapsedTime(elapsedTime);
    } else {
      // Démarrer le chronomètre
      setIsRunning(true);
      // Définir le nouveau temps de début comme la date actuelle moins le temps écoulé
      const now = new Date();
      setStartTime(now - elapsedTime);
      // Remplir dateRealisation uniquement si elle est null
      if (!dateRealisation) {
        setDateRealisaton(now);
      }
    }

    // Mise à jour de la durée de réalisation si le chronomètre est arrêté
    if (!isRunning) {
      // Mettre à jour la durée de réalisation avec le temps écoulé
      setDureeRealisation(elapsedTime);
    }
  };

  useEffect(() => {
    // Mise à jour de la durée de réalisation lors de chaque mise à jour de elapsedTime
    if (elapsedTime) {
      setDureeRealisation(elapsedTime);
    }
  }, [elapsedTime]);

  const resetTimer = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setSavedElapsedTime(0); // Réinitialiser le temps écoulé sauvegardé
    setStartTime(null);
  };

  const [isInterventionCompleted, setIsInterventionCompleted] = useState(false);

  const handleInterventionCompletion = async () => {
    // Mettre à jour le statut et la date de clôture seulement si l'intervention n'a pas déjà été marquée comme terminée
    if (!isInterventionCompleted) {
      setDateCloture(new Date());
      setIsInterventionCompleted(true);
    }
  };

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        const now = new Date();
        const elapsed = now - startTime;
        setElapsedTime(elapsed);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, startTime]);

  const formatElapsedTime = (ms) => {
    // Convertir le temps en secondes
    const totalSeconds = Math.floor(ms / 1000);
    // Calculer le nombre de jours
    const days = Math.floor(totalSeconds / (3600 * 24));
    // Calculer le nombre d'heures restantes après avoir retiré les jours
    const remainingSeconds = totalSeconds % (3600 * 24);
    const hours = Math.floor(remainingSeconds / 3600);
    // Calculer le nombre de minutes restantes après avoir retiré les heures
    const remainingSecondsAfterHours = remainingSeconds % 3600;
    const minutes = Math.floor(remainingSecondsAfterHours / 60);
    // Calculer le nombre de secondes restantes après avoir retiré les minutes
    const seconds = remainingSecondsAfterHours % 60;
    // Construire la chaîne de format
    return `${days.toString().padStart(2, "0")}:${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleClick = () => {
    navigate(`/technicien/piece-rechange?ticketId=${ticketData.interCode}`);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          color="#aebfcb"
          fontSize="30px"
          margin="10px"
          sx={{
            fontWeight: 500, // épaisseur de la police
          }}
        >
          Gérer Ticket
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          sx={{marginLeft:80}}
          startIcon={<AddShoppingCartIcon />}
        >
          Demande de Pièces de Rechange
        </Button>
        <IconButton
          onClick={handleInterventionCompletion}
          sx={{
            bgcolor: theme.palette.mode === "light" ? "#4caf50" : "#1b5e20", // Vert pour le mode clair et une nuance de vert plus foncé pour le mode sombre
            color: theme.palette.mode === "light" ? "#fff" : "#bdbdbd", // Blanc pour le mode clair et gris clair pour le mode sombre
            "&:hover": {
              bgcolor: theme.palette.mode === "light" ? "#388e3c" : "#015d19", // Vert foncé pour le mode clair et une nuance de vert plus foncé pour le mode sombre au survol
            },
          }}
        >
          <Done />
        </IconButton>
      </Box>
      <Box
        display="flex"
        p={2}
        flexDirection="column"
        justifyContent="center"
        margin="auto"
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.background.main
              : theme.palette.background.main,
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "20px", // Ajout de marge en bas pour séparer les deux parties
        }}
      >
        <Header
          title={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: theme.palette.primary.main,
                }}
              >
                <ConfirmationNumberOutlined />
                Nouveau Intervention
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: isRunning
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                    transition: "color 0.3s ease",
                  }}
                >
                  {formatElapsedTime(elapsedTime)}
                </Typography>
                <Box>
                  <IconButton
                    onClick={toggleTimer}
                    sx={{
                      bgcolor:
                        theme.palette.mode === "light"
                          ? "white"
                          : theme.palette.background.main,
                      color: isRunning
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                      "&:hover": {
                        bgcolor: "white",
                      },
                    }}
                  >
                    {isRunning ? <StopIcon /> : <PlayArrowIcon />}
                  </IconButton>
                  {!isRunning && elapsedTime > 0 && (
                    <IconButton
                      onClick={resetTimer}
                      sx={{
                        bgcolor: "white",
                        color: theme.palette.warning.main,
                        "&:hover": {
                          bgcolor: "white",
                        },
                        ml: 1,
                      }}
                    >
                      <ReplayIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Box>
          }
          subTitle=""
        />

        <form onSubmit={handleSubmit(handleSaveDialog)}>
          <Grid container spacing={2}>
            {/* Partie gauche */}
            <Grid item xs={12} sm={6}>
              <Box
                bgcolor={theme.palette.mode === "light" ? "#f8f8f8" : "#3d3d3d"} // Couleur de fond du cadre
                //borderTop={1} // Bordure supérieure
                //borderBottom={1} // Bordure inférieure
                borderColor="primary.main" // Couleur de la bordure
                p={1} // Espacement intérieur
              >
                <Typography
                  fontWeight="bold"
                  variant="h6"
                  color="primary.main"
                  mb={2}
                >
                  Informations de Ticket
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      label="Code"
                      value={ticketData.interCode}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      label="Désignation"
                      value={ticketData.interDesignation}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      label="Client"
                      value={ticketData.demandeur.client.nomSociete}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      label="Demandeur"
                      value={`${ticketData.demandeur.user.nom} ${ticketData.demandeur.user.prenom}`}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Equipemnet"
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={ticketData.equipement.eqptDesignation}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Nature"
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={ticketData.interventionNature.libelle}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Priorité"
                      variant="outlined"
                      value={ticketData.interPriorite}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Sous contrat"
                      size="small"
                      variant="outlined"
                      value={ticketData.sousContrat === "O" ? "Oui" : "Non"}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Date Création"
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={formattedDate}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      label="Date prévue"
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={formattedDateT}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Durée prévue"
                      size="small"
                      variant="outlined"
                      value={ticketData.dureePrevue}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Machine arrêté"
                      size="small"
                      variant="outlined"
                      value={ticketData.machineArret}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  {ticketData.machineArret === "Oui" && (
                    <>
                      <Grid item xs={5}>
                        <TextField
                          fullWidth
                          label="Date d'arrêt"
                          size="small"
                          variant="outlined"
                          value={ticketData.dateArret}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          label="Durée d'arrêt"
                          fullWidth
                          size="small"
                          variant="outlined"
                          value={ticketData.dureeArret}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Description"
                      multiline
                      rows={4}
                      variant="outlined"
                      value={ticketData.description}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid
              item
              sx={{ borderRight: `1px solid ${theme.palette.divider}` }}
            />

            {/* Partie droite */}
            <Grid item xs={12} sm={5}>
              <Typography
                fontWeight="bold"
                variant="h6"
                color="primary.main"
                mb={1}
              >
                Planifier Intervention
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description de panne"
                    size="small"
                    variant="outlined"
                    value={descriptionPanne}
                    onChange={(e) => setDescriptionPanne(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    size="small"
                    options={types}
                    value={type} // Utilisez la valeur de l'état local comme valeur initiale
                    getOptionLabel={(option) => option.libelleType}
                    sx={{ width: "100%" }}
                    onChange={(event, value) => {
                      setType(value);
                      console.log("typeeeeeeeeeeeee", value);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Type" />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    size="small"
                    options={causes}
                    value={cause} // Utilisez la valeur de l'état local comme valeur initiale
                    getOptionLabel={(option) => option.libelle}
                    sx={{ width: "100%" }}
                    onChange={(event, value) => {
                      setCause(value);
                      console.log(value);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Cause" />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Observation"
                    variant="outlined"
                    value={interObservation}
                    onChange={(e) => setInterObservaton(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Hebergement"
                    variant="outlined"
                    value={interHebergement}
                    onChange={(e) =>
                      setInterHebergement(parseFloat(e.target.value))
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Delplacement"
                    variant="outlined"
                    value={interDeplacement}
                    onChange={(e) =>
                      setInterDeplacement(parseFloat(e.target.value))
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Compterendue"
                    placeholder="Description"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={compteRendue}
                    onChange={(e) => setCompteRendue(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={11}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? "#6b6b6b"
                        : theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "light"
                          ? "#5d5d5d"
                          : theme.palette.secondary.main,
                    },
                  }}
                >
                  Enregistrer
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  );
};

export default AjoutIntervention;
