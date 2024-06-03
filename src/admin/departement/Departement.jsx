import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Avatar,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  InputAdornment,
  Tooltip,
  useTheme,
} from "@mui/material";
import { departementService } from "../../services/departement_service";
import { technicienService } from "../../services/technicien_service";
import { imageService } from "../../services/image_service";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SearchIcon from "@mui/icons-material/Search";

const DepartementPage = () => {
  const theme = useTheme();

  const [departements, setDepartements] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [codeDepart, setCodeDepart] = useState("");
  const [nomDepart, setNomDepart] = useState("");
  const [editCodeDepart, setEditCodeDepart] = useState(null);
  const [deleteCodeDepart, setDeleteCodeDepart] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [nomDepartError, setNomDepartError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openTechDialog, setOpenTechDialog] = useState(false);
  const [selectedDepartTechniciens, setSelectedDepartTechniciens] = useState(
    []
  );

  useEffect(() => {
    loadDepartements();
    loadTechniciens();
  }, []);

  const loadDepartements = async () => {
    try {
      const response = await departementService.getAllDepartements();
      setDepartements(response.data);
    } catch (error) {
      console.error("Error fetching departements:", error);
    }
  };

  const loadTechniciens = async () => {
    try {
      const response = await technicienService.getTechniciens();
      const techniciensWithImages = await Promise.all(
        response.data.map(async (tech) => {
          let avatarUrl = "";
          if (tech.imageId) {
            try {
              const imageResponse = await imageService.getImage(tech.imageId);
              avatarUrl = `data:image/png;base64,${imageResponse.data.image}`;
            } catch (error) {
              console.error("Error fetching image for technician:", error);
            }
          }
          return { ...tech, avatarUrl };
        })
      );
      setTechniciens(techniciensWithImages);
    } catch (error) {
      console.error("Error fetching techniciens:", error);
    }
  };

  const handleAddDepartement = async () => {
    if (!nomDepart) {
      setNomDepartError("Le nom du département est requis");
      return;
    }

    const existingDepartement = departements.find(
      (departement) => departement.nomDepart === nomDepart
    );
    if (existingDepartement) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Le nom du département existe déjà");
      setSnackbarOpen(true);
      return;
    }

    try {
      await departementService.addDepartement({ nomDepart });
      loadDepartements();
      handleCloseAddDialog();
      setSnackbarSeverity("success");
      setSnackbarMessage("Le département a été ajouté avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding departement:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de l'ajout du département");
      setSnackbarOpen(true);
    }
  };

  const handleUpdateDepartement = async () => {
    if (!nomDepart) {
      setNomDepartError("Le nom du département est requis");
      return;
    }
    try {
      await departementService.updateDepartement({
        codeDepart: editCodeDepart,
        nomDepart,
      });
      loadDepartements();
      handleCloseEditDialog();
      setSnackbarSeverity("success");
      setSnackbarMessage("Le département a été mis à jour avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating departement:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de la mise à jour du département");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteDepartement = async () => {
    try {
      await departementService.deleteDepartement(deleteCodeDepart);
      setOpenDeleteDialog(false);
      setDeleteCodeDepart(null);
      loadDepartements();
      setSnackbarSeverity("success");
      setSnackbarMessage("Le département a été supprimé avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting departement:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de la suppression du département");
      setSnackbarOpen(true);
    }
  };

  const handleOpenDeleteDialog = (codeDepart) => {
    setOpenDeleteDialog(true);
    setDeleteCodeDepart(codeDepart);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteCodeDepart(null);
  };

  const handleNomDepartChange = (e) => {
    setNomDepart(e.target.value);
    setNomDepartError("");
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
    setNomDepart("");
    setNomDepartError("");
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = (codeDepart, nomDepart) => {
    setEditCodeDepart(codeDepart);
    setCodeDepart(codeDepart);
    setNomDepart(nomDepart);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditCodeDepart(null);
    setCodeDepart("");
    setNomDepart("");
  };

  const handleOpenTechDialog = (techniciens) => {
    setSelectedDepartTechniciens(techniciens);
    setOpenTechDialog(true);
  };

  const handleCloseTechDialog = () => {
    setOpenTechDialog(false);
    setSelectedDepartTechniciens([]);
  };

  const filteredDepartements = departements.filter((departement) =>
    departement.nomDepart.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      style={{ margin: "5px", padding: "20px", minHeight: "calc(100vh - 64px)" }}
    >
      <Typography
        color="#aebfcb"
        fontSize="30px"
        marginBottom="10px"
        sx={{
          fontWeight: 500, // épaisseur de la police
        }}
      >
        Liste de Departements
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          placeholder="Rechercher..."
          value={searchQuery}
          size="small"
          onChange={handleSearchQueryChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          style={{ textTransform: "none" }}
        >
          Ajouter Departement
        </Button>
      </Box>

      <Grid container spacing={3}>
        {filteredDepartements.map((departement) => (
          <Grid item xs={12} md={6} lg={4} key={departement.codeDepart}>
            <Card
              sx={{ width: "auto", height: "auto", borderRadius: 3, boxShadow: 3 }}
            >
              <CardHeader
                title={
                  <Typography variant="h6">{departement.nomDepart}</Typography>
                }
                subheader={
                  <Typography
                    variant="body2"
                    color="textSecondary"
                  >{`Total ${techniciens.length} techniciens`}</Typography>
                }
                action={
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        handleOpenEditDialog(
                          departement.codeDepart,
                          departement.nomDepart
                        )
                      }
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() =>
                        handleOpenDeleteDialog(departement.codeDepart)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              />
              <CardContent>
                <Grid container spacing={1} alignItems="center">
                  {techniciens
                    .filter(
                      (tech) => tech.codeDepart === departement.codeDepart
                    )
                    .slice(0, 6)
                    .map((tech) => (
                      <Grid item key={tech.id}>
                        <Tooltip title={`${tech.nom} ${tech.prenom}`} arrow>
                          <Avatar
                            alt={`${tech.nom} ${tech.prenom}`}
                            src={tech.avatarUrl || ""}
                            sx={{ width: 48, height: 48 }}
                          />
                        </Tooltip>
                      </Grid>
                    ))}
                  {techniciens.filter(
                    (tech) => tech.codeDepart === departement.codeDepart
                  ).length > 1 && (
                    <Grid item>
                      <IconButton
                        onClick={() =>
                          handleOpenTechDialog(
                            techniciens.filter(
                              (tech) =>
                                tech.codeDepart === departement.codeDepart
                            )
                          )
                        }
                      >
                        <MoreHorizIcon />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          style={{
            color: theme.palette.mode === "light" ? "#5381bd" : "#f6f7f9",
          }}
        >
          Ajouter un département
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du Département"
            fullWidth
            value={nomDepart}
            onChange={handleNomDepartChange}
            error={Boolean(nomDepartError)}
            helperText={nomDepartError}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleAddDepartement} color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          style={{
            color: theme.palette.mode === "light" ? "#5381bd" : "#f6f7f9",
          }}
        >
          Modifier le département
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du Département"
            fullWidth
            value={nomDepart}
            onChange={handleNomDepartChange}
            error={Boolean(nomDepartError)}
            helperText={nomDepartError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Annuler</Button>
          <Button onClick={handleUpdateDepartement} color="primary">
            Mettre à jour
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer ce département ?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Annuler</Button>
          <Button onClick={handleDeleteDepartement} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openTechDialog} onClose={handleCloseTechDialog}>
        <DialogTitle>Liste des techniciens</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {selectedDepartTechniciens.map((tech, index) => (
              <Grid item xs={12} sm={4} key={tech.id}>
                <Paper
                  style={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%", height: "100px"
                  }}
                >
                  <Avatar
                    alt={tech.name}
                    src={tech.avatarUrl || ""}
                    style={{  width: 60, height: 60, marginRight:"10px" }}
                    />
                  <Typography variant="body1" >
                     {tech.prenom} {tech.nom}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTechDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DepartementPage;
