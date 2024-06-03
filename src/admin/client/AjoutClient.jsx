import {
  Box,
  Button,
  Grid,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { GroupAddOutlined } from "@mui/icons-material";
import { clientService } from "../../services/client_service";

const regEmail =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const AjoutClient = () => {
  let navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    watch,
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

  const handleSaveDialog = (data) => {
    const client = {
      nomSociete: data.nomSociete,
      adresse: data.adresse,
      codePostal: data.postal,
      emailSociete: data.mail,
      dateEntree: new Date(),
      tel: data.tel,
      ville: data.ville,
    };
    console.log(client);
    clientService
      .creerClient(client)
      .then((response) => {
        console.log("Client added successfully:", response.data);
        handleClick();
        navigate("/admin/client");
        reset();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      clearErrors(name);
    });
    return () => subscription.unsubscribe();
  }, [watch, clearErrors]);

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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "24px",
              fontWeight: "bold",
              color: theme.palette.primary.main,
            }}
          >
            <GroupAddOutlined />
            Créer une nouvelle Société
          </Box>
        }
        subTitle=""
      />
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(handleSaveDialog)}
      >
        <Grid container spacing={2} sx={{ maxWidth: "700px" }}>
          <Grid item xs={6}>
            <TextField
              error={Boolean(errors.nomSociete)}
              helperText={errors.nomSociete ? "Nom est requis" : null}
              {...register("nomSociete", { required: true })}
              label="Nom"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              error={Boolean(errors.mail)}
              helperText={
                errors.mail ? "Veuillez fournir une adresse email valide" : null
              }
              {...register("mail", { required: true, pattern: regEmail })}
              id="outlined-basic"
              label="Adresse mail"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              error={Boolean(errors.adresse)}
              helperText={errors.adresse ? "Adresse est requise" : null}
              {...register("adresse", { required: true })}
              label="Adresse"
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              error={Boolean(errors.ville)}
              helperText={errors.ville ? "Ville est requise" : null}
              {...register("ville", { required: true })}
              label="Ville"
              fullWidth
            ></TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              error={Boolean(errors.postal)}
              helperText={errors.postal?.message}
              {...register("postal", {
                required: "Code postal est requis",
                minLength: {
                  value: 4,
                  message: "Le code postal doit être composé de 4 chiffres",
                },
                maxLength: {
                  value: 4,
                  message: "Le code postal doit être composé de 4 chiffres",
                },
              })}
              label="Code Postal"
              type="number"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              error={Boolean(errors.tel)}
              helperText={errors.tel?.message}
              {...register("tel", {
                required: "Téléphone est requis",
                minLength: {
                  value: 8,
                  message: "Téléphone doit être composé de 8 chiffres",
                },
                maxLength: {
                  value: 8,
                  message: "Téléphone doit être composé de 8 chiffres",
                },
              })}
              label="Téléphone"
              fullWidth
            ></TextField>
          </Grid>
          <Grid item xs={9} />
          <Grid item xs={3}>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{
                backgroundColor:
                  theme.palette.mode === "light"
                    ? theme.palette.primary.main
                    : theme.palette.primary.main,
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "light"
                      ? theme.palette.secondary.main
                      : theme.palette.secondary.main,
                },
              }}
            >
              Créer
            </Button>
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
        </Grid>
      </Box>
    </Box>
  );
};

export default AjoutClient;
