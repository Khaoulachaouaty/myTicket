import { useState, useEffect } from 'react';
import { Button, TextField, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material';
import { causeService } from '../../services/cause_service';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const DepartementPage = () => {
  const [causes, setCauses] = useState([]);
  const [codeCause, setCodeCause] = useState('');
  const [nomCause, setNomCause] = useState('');
  const [editCodeCause, setEditCodeCause] = useState(null);
  const [deleteCodeCause, setDeleteCodeCause] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [nomCauseError, setNomCauseError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');

  useEffect(() => {
    loadCauses();
  }, []);

  const loadCauses = async () => {
    try {
      const response = await causeService.getAllCauses();
      setCauses(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching causes:", error);
    }
  };

  const handleAddCause = async () => {
    if (!nomCause) {
      setNomCauseError("Le nom de la cause est requis");
      return;
    }

    // Vérifier si le nom de la cause existe déjà
    const existingCause = causes.find(cause => cause.libelle === nomCause);
    if (existingCause) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Le nom de la cause existe déjà");
      setSnackbarOpen(true);
      return;
    }

    try {
      await causeService.addCause({ libelle: nomCause });
      loadCauses();
      setNomCause('');
      setSnackbarSeverity("success");
      setSnackbarMessage("La cause a été ajoutée avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding cause:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de l'ajout de la cause");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteCause = async () => {
    try {
      await causeService.deleteCause(deleteCodeCause);
      setOpenDeleteDialog(false);
      setDeleteCodeCause(null);
      loadCauses();
      setSnackbarSeverity("success");
      setSnackbarMessage("La cause a été supprimée avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting cause:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de la suppression de la cause");
      setSnackbarOpen(true);
    }
  };

  const handleEditCause = (codeCause, nomCause) => {
    setEditCodeCause(codeCause);
    setCodeCause(codeCause);
    setNomCause(nomCause);
  };

  const handleUpdateCause = async () => {
    if (!nomCause) {
      setNomCauseError("Le nom de la cause est requis");
      return;
    }
    try {
      await causeService.updateCause({ codeCause: editCodeCause, libelle: nomCause });
      loadCauses();
      setEditCodeCause(null);
      setCodeCause('');
      setNomCause('');
      setSnackbarSeverity("success");
      setSnackbarMessage("La cause a été mise à jour avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating cause:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de la mise à jour de la cause");
      setSnackbarOpen(true);
    }
  };

  const handleOpenDeleteDialog = (codeCause) => {
    setOpenDeleteDialog(true);
    setDeleteCodeCause(codeCause);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteCodeCause(null);
  };

  const handleNomCauseChange = (e) => {
    setNomCause(e.target.value);
    setNomCauseError(''); // Réinitialiser l'erreur quand l'utilisateur commence à écrire
  };

  return (
    <div style={{ margin: '20px', padding: '20px' }}>
      <Typography variant="h4" gutterBottom style={{ marginBottom: '20px' }}>Gestion des Causes</Typography>

      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
        <TextField
          label="Nom de la cause"
          value={nomCause}
          onChange={handleNomCauseChange}
          error={!!nomCauseError}
          helperText={nomCauseError}
        />
        <Button variant="contained" onClick={editCodeCause ? handleUpdateCause : handleAddCause}>
          {editCodeCause ? "Modifier" : "Ajouter"}
        </Button>
      </div>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Code</TableCell>
                <TableCell align="center">Nom</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {causes.map(cause => (
                <TableRow key={cause.codeCause}>
                  <TableCell align="center">{cause.codeCause}</TableCell>
                  <TableCell align="center">{cause.libelle}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEditCause(cause.codeCause, cause.libelle)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDeleteDialog(cause.codeCause)} color="secondary">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cette cause ?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Annuler</Button>
          <Button onClick={handleDeleteCause} color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%", ml: 7 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DepartementPage;
