import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Alert from "@mui/material/Alert";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/user_service";
import { PersonAddAltOutlined } from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import frLocale from "date-fns/locale/fr";
import { clientService } from "../../services/client_service";

const regEmail =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const AjoutEquipe = () => {
  const navigate = useNavigate();
  const [client, setClient] = useState ([]);
  
  const loadClient = async () => {
    try {
      const res = await clientService.getAllClients()
      setClient(res.data); // Mettre à jour l'état type avec les données récupérées de l'API
      console.log(res);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  useEffect(() => {
    loadClient();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const [nom, setNom] = useState("khaoula");
  const [prenom, setPrenom] = useState("khaoula");
  const [email, setEmail] = useState("khaoulachaouatyy@gmail.com");
  const [sexe, setSexe] = useState("H");
  const [dateNais, setDateNais] = useState(null);
  const [c, setC] = useState("");
  const [cin, setCin] = useState("")

  const handleSaveDialog = (data) => {
    const user = {
      nom: data.nom,
      prenom: data.prenom,
      email: data.mail,
      codeClient: c,
      role: "CLIENT",
      dateNaiss: dateNais,
      sexe: sexe,
      cin: cin,
    };
    console.log("User data to be submitted:", user);

    userService
      .creerUser(user)
      .then(() => {
        handleClick();
        navigate("/admin/demandeurs");
        reset();
      })
      .catch((error) => {
        console.error("Error creating user:", error);
      });
  };

  const handleChangeSexe = (event) => {
    setSexe(event.target.value);
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        p: 3,
        mt: 4,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: 1,
        minHeight: "calc(88vh - 64px)",
      }}
    >
      <Header
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonAddAltOutlined />
            Ajouter un nouveau demandeur
          </Box>
        }
        subTitle=""
      />
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(handleSaveDialog)}
        sx={{ mt: 3 , height:20}}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              
              {...register("nom", { required: true, minLength: 3 })}
              label="Nom"
              variant="outlined"
              fullWidth
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register("prenom", { required: true, minLength: 3 })}
              label="Prénom"
              fullWidth
              variant="outlined"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              {...register("mail", { required: true, pattern: regEmail })}
              id="outlined-basic"
              label="Adresse email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register("cin", { required: true, minLength: 8, maxLength: 8 })}
              label="Numéro de carte d'identité"
              variant="outlined"
              fullWidth
              value={cin}
              onChange={(e) => setCin(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
              <Autocomplete
                disablePortal
                options={client}
                getOptionLabel={(option) => option.nomSociete}
                sx={{ width: "100%" }}
                // @ts-ignore
                onChange={(event, value) => {
                  setC(value.codeClient);
                  console.log(value.codeClient);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Client"
                    {...register("codeC", { required: true })}
                    error={Boolean(errors.codeC)}
                    helperText={
                      errors.codeType
                        ? "Ce champ est obligatoire"
                        : null
                    }
                  />
                )}
              />
            </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              locale={frLocale}
            >
              <Stack spacing={2}>
                <DatePicker
                  label="Date de naissance"
                  value={dateNais}
                  onChange={(date) => setDateNais(date)}
                  inputFormat="dd/MM/yyyy"
                  error={Boolean(errors.dateNais)} // Correction de la propriété d'erreur
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      helperText={
                        errors.dateNais ? "Ce champ est obligatoire" : null
                      } // Correction de l'attribut helperText
                      {...register("dateNais", { required: true })}
                    />
                  )}
                />
              </Stack>
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={3}>
            <Box display="flex" alignItems="center">
              <Typography component="legend" sx={{ mr: 2 }}>
                Sexe :
              </Typography>
              <RadioGroup row value={sexe} onChange={handleChangeSexe}>
                <FormControlLabel value="H" control={<Radio />} label="H" />
                <FormControlLabel value="F" control={<Radio />} label="F" />
              </RadioGroup>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: theme.palette.secondary.main,
                },
              }}
            >
              Créer
            </Button>
          </Grid>
        </Grid>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Compte créé avec succès
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AjoutEquipe;