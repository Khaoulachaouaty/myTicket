import React, { useState, useEffect } from 'react';
import { Button, TextField, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Grid } from '@mui/material';
import { typeInterService } from '../../services/typeInter_service';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';

const TypeInterPage = () => {
  const [typesIntervention, setTypesIntervention] = useState([]);
  const [libelle, setLibelle] = useState('');
  const [description, setDescription] = useState('');
  const [duree, setDuree] = useState('');
  const [uniteDuree, setUniteDuree] = useState('');
  const [editId, setEditId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteTypeCode, setDeleteTypeCode] = useState(null); 
  const [libelleError, setLibelleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [dureeError, setDureeError] = useState('');
  const [uniteDureeError, setUniteDureeError] = useState('');
  const [unitOptions] = useState(['secondes', 'minutes', 'heures']);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');

  useEffect(() => {
    loadTypesIntervention();
  }, []);

  const loadTypesIntervention = async () => {
    try {
      const response = await typeInterService.getAllTypeInter();
      setTypesIntervention(response.data);
    } catch (error) {
      console.error("Error fetching type data:", error);
    }
  };

  const handleAddTypeInter = async () => {
    let isValid = true;
    if (!libelle) {
      setLibelleError("Le libellé est requis");
      isValid = false;
    }
    if (!description) {
      setDescriptionError("La description est requise");
      isValid = false;
    }
    if (!duree) {
      setDureeError("La durée est requise");
      isValid = false;
    }
    if (!uniteDuree) {
      setUniteDureeError("L'unité de durée est requise");
      isValid = false;
    }
    if (!isValid) {
      return;
    }
    const type = {
      libelleType: libelle,
      description: description,
      duree: duree,
      unitCodeDuree: uniteDuree,
    };
    try {
      await typeInterService.addTypeInter(type);
      clearForm();
      setOpenDialog(false);
      loadTypesIntervention();
      setSnackbarSeverity("success");
      setSnackbarMessage("Le type d'intervention a été ajouté avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding type:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de l'ajout du type d'intervention");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteTypeInter = async (code) => {
    try {
      await typeInterService.deleteTypeInter(code);
      loadTypesIntervention();
      setSnackbarSeverity("success");
      setSnackbarMessage("Le type d'intervention a été supprimé avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting type:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de la suppression du type d'intervention");
      setSnackbarOpen(true);
    }
  };

  const handleEditTypeInter = (type) => {
    setEditId(type.codeType);
    setLibelle(type.libelleType);
    setDescription(type.description);
    setDuree(type.duree);
    setUniteDuree(type.unitCodeDuree);
    setOpenDialog(true);
  };

  const handleUpdateTypeInter = async (id) => {
    let isValid = true;
    if (!libelle) {
      setLibelleError("Le libellé est requis");
      isValid = false;
    }
    if (!description) {
      setDescriptionError("La description est requise");
      isValid = false;
    }
    if (!duree) {
      setDureeError("La durée est requise");
      isValid = false;
    }
    if (!uniteDuree) {
      setUniteDureeError("L'unité de durée est requise");
      isValid = false;
    }
    if (!isValid) {
      return;
    }
    const type = {
      codeType: id,
      libelleType: libelle,
      description: description,
      duree: duree,
      unitCodeDuree: uniteDuree,
    };
    
    try {
      await typeInterService.updateTypeInter(type);
      clearForm();
      setOpenDialog(false);
      loadTypesIntervention();
      setSnackbarSeverity("success");
      setSnackbarMessage("Le type d'intervention a été mis à jour avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating type:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de la mise à jour du type d'intervention");
      setSnackbarOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    clearForm();
  };

  const clearForm = () => {
    setEditId(null);
    setLibelle('');
    setDescription('');
    setDuree('');
    setUniteDuree('');
    setLibelleError('');
    setDescriptionError('');
    setDureeError('');
    setUniteDureeError('');
  };

  const handleLibelleChange = (e) => {
    setLibelle(e.target.value);
    setLibelleError(''); 
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setDescriptionError(''); 
  };

  const handleDureeChange = (e) => {
    setDuree(e.target.value);
    setDureeError(''); 
  };

  const handleUniteDureeChange = (e, value) => {
    setUniteDuree(value);
    setUniteDureeError(''); 
  };

  return (
    <div style={{ margin: '20px', padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Gestion des Types d'Intervention</Typography>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>Ajouter un type</Button>
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Libellé</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Durée</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {typesIntervention.map(type => (
                <TableRow key={type.codeType}>
                  <TableCell>{type.codeType}</TableCell>
                  <TableCell>{type.libelleType}</TableCell>
                  <TableCell>{type.description}</TableCell>
                  <TableCell>{type.duree} {type.unitCodeDuree}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditTypeInter(type)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => setDeleteTypeCode(type.codeType)} color="secondary">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editId ? "Modifier le Type d'Intervention" : "Ajouter un Type d'Intervention"}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Libellé"
                value={libelle}
                onChange={handleLibelleChange}
                fullWidth
                error={!!libelleError}
                helperText={libelleError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={description}
                onChange={handleDescriptionChange}
                fullWidth
                error={!!descriptionError}
                helperText={descriptionError}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Durée"
                value={duree}
                onChange={handleDureeChange}
                fullWidth
                error={!!dureeError}
                helperText={dureeError}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                options={unitOptions}
                value={uniteDuree}
                onChange={handleUniteDureeChange}
                renderInput={(params) => <TextField {...params} label="Unité de durée" fullWidth />}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={editId ? () => handleUpdateTypeInter(editId) : handleAddTypeInter}>{editId ? "Modifier" : "Ajouter"}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteTypeCode} onClose={() => setDeleteTypeCode(null)}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer ce type d'intervention ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTypeCode(null)}>Annuler</Button>
          <Button onClick={() => {
            handleDeleteTypeInter(deleteTypeCode);
            setDeleteTypeCode(null);
          }}color="error">Confirmer</Button>
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
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default TypeInterPage;
