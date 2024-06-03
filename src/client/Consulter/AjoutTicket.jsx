import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  useTheme,
  FormControlLabel,
  Box,
  Typography,
  Snackbar,
  Alert,
  Checkbox,
  Autocomplete,
  Stack
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ticketService } from "../../services/ticke_servicet";
import { adminService } from "../../services/equipement_service";
import { technicienService } from "../../services/technicien_service";
import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { userService } from "../../services/user_service";

const AddTicketForm = () => {
  const theme = useTheme();
  const [designation, setDesignation] = useState("");
  const [description, setDescription] = useState("");
  const [sousGarantie, setSousGarantie] = useState("N");
  const [sousContrat, setSousContrat] = useState("N");
  const [priorite, setPriorite] = useState("");
  const [machineArret, setMachineArret] = useState("Non");
  const [dureeArret, setDureeArret] = useState(0);
  const [dateArret, setDateArret] = useState(null);
  const [equipement, setEquipement] = useState(null);
  const [nature, setNature] = useState([]);
  const [technicien, setTechnicien] = useState(null);

  const [eq, setEq] = useState([]);
  const [nat, setNat] = useState([]);
  const [techniciens, setTechniciens] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [designationError, setDesignationError] = useState(false);
  const [equipementError, setEquipementError] = useState(false);
  const [profile, setProfile] = useState([]);

  let navigate = useNavigate();

  const loadNature = async () => {
    try {
      const response = await ticketService.getAllNature();
      setNat(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  const loadProfile = async () => {
    try {
      const response = await userService.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const loadEquipement = async (codeClient) => {
    try {
      const response = await adminService.getAllEquipementsByClient(codeClient);
      setEq(response.data);
      console.log(response.data,"1111111111111")
    } catch (error) {
      console.error("Error fetching equipment data:", error);
    }
  };

  const loadTechniciens = async () => {
    try {
      const response = await technicienService.getAllTechniciens();
      setTechniciens(response.data);
      console.log("tec", response.data);
    } catch (error) {
      console.error("Error fetching technicians data:", error);
    }
  };

  useEffect(() => {
    loadProfile();
    loadTechniciens();
    loadNature();
  }, []);

  useEffect(() => {
    if (profile.codeClient) {
      loadEquipement(profile.codeClient);
    }
  }, [profile]);

  console.log(equipement,"2222")

  console.log(profile, "000");

  const prio = ["Haute", "Moyenne", "Faible"];

  const handleSaveDialog = () => {
    // Reset errors
    setDesignationError(false);
    setEquipementError(false);

    // Vérification si les champs obligatoires sont vides
    let hasError = false;
    if (!designation) {
      setDesignationError(true);
      hasError = true;
    }

    if (!equipement) {
      setEquipementError(true);
      hasError = true;
    }

    if (hasError) {
      setSnackbarMessage("Les champs obligatoires sont manquants");
      setSnackbarOpen(true);
      return;
    }

    const ticket = {
      dateArre: dateArret,
      description: description,
      dureeArret: dureeArret,
      equipement: equipement,
      dateCreation: new Date(),
      interDesignation: designation,
      interPriorite: priorite,
      interStatut: "En attente",
      interventionNature: nature,
      machineArret: machineArret,
      sousContrat: sousContrat,
      sousGarantie: sousGarantie,
      technicien: technicien ? { codeTechnicien: technicien.codeTechnicien } : null,
    };
    console.log("avant l'ajout", ticket);
    ticketService
      .addTicket(ticket)
      .then((response) => {
        navigate("/client/consulter_tickets");
        console.log("ticket added successfully:", response.data);
        reset();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();


  return (
    <>
      
      <Box
        component="form"
        onSubmit={handleSubmit(handleSaveDialog)}
        sx={{
          maxWidth: 800,
          margin: "auto",
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" color="secondary" mb={2}>
              <ConfirmationNumberOutlined /> Nouveau Ticket
            </Typography>
          </Grid>
          <Grid item xs={12} >
            <TextField
              fullWidth
              label="Désignation"
              variant="outlined"
              size="small"
              value={designation}
              onChange={(e) => {
                setDesignation(e.target.value);
                if (e.target.value) setDesignationError(false);
              }}
              error={designationError}
              helperText={designationError && "La désignation est obligatoire"}
            />
          </Grid>
          <Grid item xs={12} >
            <Autocomplete
              options={nat}
              size="small"
              getOptionLabel={(option) => option.libelle}
              renderInput={(params) => <TextField {...params} label="Nature" variant="outlined" />}
              onChange={(event, value) => setNature(value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={eq}
              size="small"
              getOptionLabel={(option) => option.eqptDesignation}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Equipement"
                  variant="outlined"
                  error={equipementError}
                  helperText={equipementError && "L'équipement est obligatoire"}
                />
              )}
              onChange={(event, value) => {
                setEquipement(value);
                if (value) setEquipementError(false);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={prio}
              size="small"
              renderInput={(params) => <TextField {...params} label="Priorité" variant="outlined" />}
              onChange={(event, value) => setPriorite(value)}
            />
          </Grid>
          <Grid item xs={12} >
            <Autocomplete
              options={techniciens}
              size="small"
              getOptionLabel={(option) => `${option.user.nom} ${option.user.prenom}`}
              renderInput={(params) => (
                <TextField {...params} label="Technicien" variant="outlined" />
              )}
              onChange={(event, value) => setTechnicien(value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              size="small"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sousContrat === "O"}
                  onChange={(e) => setSousContrat(e.target.checked ? "O" : "N")}
                />
              }
              label="Sous Contrat"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sousGarantie === "O"}
                  onChange={(e) => setSousGarantie(e.target.checked ? "O" : "N")}
                />
              }
              label="Sous Garantie"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={machineArret === "Oui"}
                  onChange={(e) => setMachineArret(e.target.checked ? "Oui" : "Non")}
                />
              }
              label="Machine à l'arrêt"
            />
          </Grid>
          {machineArret === "Oui" && (
            <>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Date de l'arrêt"
                    value={dateArret}
                    onChange={setDateArret}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Durée de l'arrêt (en heures)"
                  variant="outlined"
                  type="number"
                  value={dureeArret}
                  onChange={(e) => setDureeArret(e.target.value)}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" type="submit">
              Ajouter
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddTicketForm;
