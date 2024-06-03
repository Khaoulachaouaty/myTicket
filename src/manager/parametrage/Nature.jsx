import { useState, useEffect } from 'react';
import { Button, TextField, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { natureService } from '../../services/nature_service';

const NaturePage = () => {
  const [natures, setNatures] = useState([]);
  const [libelle, setLibelle] = useState('');
  const [factMethode, setFactMethode] = useState('');
  const [ingcCode, setIngcCode] = useState('');
  const [factReelPieces, setFactReelPieces] = useState(0);
  const [factReelMo, setFactReelMo] = useState(0);
  const [factReelFrais, setFactReelFrais] = useState(0);
  const [editCode, setEditCode] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteCode, setDeleteCode] = useState(null);
  const [libelleError, setLibelleError] = useState('');
  const [factMethodeError, setFactMethodeError] = useState('');
  const [ingcCodeError, setIngcCodeError] = useState('');
  const [factReelPiecesError, setFactReelPiecesError] = useState('');
  const [factReelMoError, setFactReelMoError] = useState('');
  const [factReelFraisError, setFactReelFraisError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');

  useEffect(() => {
    loadNatures();
  }, []);

  const loadNatures = async () => {
    try {
      const response = await natureService.getAllNature();
      setNatures(response.data);
    } catch (error) {
      console.error("Error fetching nature data:", error);
    }
  };

  const handleAddNature = async () => {
    let isValid = true;
    if (!libelle) {
      setLibelleError("Le libellé est requis");
      isValid = false;
    }
    if (!factMethode) {
      setFactMethodeError("La méthode de facturation est requise");
      isValid = false;
    }
    if (!ingcCode) {
      setIngcCodeError("Le code INGC est requis");
      isValid = false;
    }
    if (!factReelPieces.trim().length) {
      setFactReelPiecesError("Le montant réel des pièces est requis");
      isValid = false;
    }
    if (!factReelMo.trim().length) {
      setFactReelMoError("Le montant réel de la main-d'œuvre est requis");
      isValid = false;
    }
    if (!factReelFrais.trim().length) {
      setFactReelFraisError("Le montant réel des frais est requis");
      isValid = false;
    }
    
    if (!isValid) {
      return;
    }
    const nature = {
      libelle: libelle,
      facturationMethode: factMethode,
      ingcCode: ingcCode,
      facturationReellePieces: factReelPieces,
      facturationReelleMO: factReelMo,
      facturationReelleFrais: factReelFrais,
    };
    try {
      await natureService.addNature(nature);
      clearForm();
      setOpenDialog(false);
      loadNatures();
      setSnackbarSeverity("success");
      setSnackbarMessage("La nature a été ajoutée avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding nature:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de l'ajout de la nature");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteNature = async (code) => {
    try {
      await natureService.deleteNature(code);
      loadNatures();
      setSnackbarSeverity("success");
      setSnackbarMessage("La nature a été supprimée avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting nature:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de la suppression de la nature");
      setSnackbarOpen(true);
    }
  };

  const handleEditNature = (nature) => {
    setEditCode(nature.code);
    setLibelle(nature.libelle);
    setFactMethode(nature.facturationMethode);
    setIngcCode(nature.ingcCode);
    setFactReelPieces(nature.facturationReellePieces);
    setFactReelMo(nature.facturationReelleMO);
    setFactReelFrais(nature.facturationReelleFrais);
    setOpenDialog(true);
  };

  const handleUpdateNature = async () => {
    let isValid = true;
    if (!libelle) {
      setLibelleError("Le libellé est requis");
      isValid = false;
    }
    if (!factMethode) {
      setFactMethodeError("La méthode de facturation est requise");
      isValid = false;
    }
    if (!ingcCode) {
      setIngcCodeError("Le code INGC est requis");
      isValid = false;
    }
    if (!factReelPieces.trim()) {
      setFactReelPiecesError("Le montant réel des pièces est requis");
      isValid = false;
    } else if (factReelPieces.trim().length !== 1) {
      setFactReelPiecesError("Le montant réel des pièces doit contenir une seule lettre");
      isValid = false;
    }
    
    if (!factReelMo.trim()) {
      setFactReelMoError("Le montant réel de la main-d'œuvre est requis");
      isValid = false;
    } else if (factReelMo.trim().length !== 1) {
      setFactReelMoError("Le montant réel de la main-d'œuvre doit contenir une seule lettre");
      isValid = false;
    }
    
    if (!factReelFrais.trim()) {
      setFactReelFraisError("Le montant réel des frais est requis");
      isValid = false;
    } else if (factReelFrais.trim().length !== 1) {
      setFactReelFraisError("Le montant réel des frais doit contenir une seule lettre");
      isValid = false;
    }
    if (!isValid) {
      return;
    }
    const nature = {
      code: editCode,
      libelle: libelle,
      facturationMethode: factMethode,
      ingcCode: ingcCode,
      facturationReellePieces: factReelPieces,
      facturationReelleMO: factReelMo,
      facturationReelleFrais: factReelFrais,
    };
    console.log(nature)
    try {
      await natureService.updateNature(nature);
      clearForm();
      setOpenDialog(false);
      loadNatures();
      setSnackbarSeverity("success");
      setSnackbarMessage("La nature a été mise à jour avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating nature:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erreur lors de la mise à jour de la nature");
      setSnackbarOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    clearForm();
  };

  const clearForm = () => {
    setEditCode(null);
    setLibelle('');
    setFactMethode('');
    setIngcCode('');
    setFactReelPieces(0);
    setFactReelMo(0);
    setFactReelFrais(0);
    setLibelleError('');
    setFactMethodeError('');
    setIngcCodeError('');
    setFactReelPiecesError('');
    setFactReelMoError('');
    setFactReelFraisError('');
  };

  const handleLibelleChange = (e) => {
    setLibelle(e.target.value);
    setLibelleError('');
  };

  const handleFactMethodeChange = (e) => {
    setFactMethode(e.target.value);
    setFactMethodeError('');
  };

  const handleIngcCodeChange = (e) => {
    setIngcCode(e.target.value);
    setIngcCodeError('');
  };

  const handleFactReelPiecesChange = (e) => {
    const value = parseFloat(e.target.value);
    setFactReelPieces(isNaN(value) ? '' : value); // Assurez-vous que la valeur reste vide si la conversion échoue
    setFactReelPiecesError('');
  };
  
  const handleFactReelMoChange = (e) => {
    const value = parseFloat(e.target.value);
    setFactReelMo(isNaN(value) ? '' : value); // Assurez-vous que la valeur reste vide si la conversion échoue
    setFactReelMoError('');
  };
  
  const handleFactReelFraisChange = (e) => {
    const value = parseFloat(e.target.value);
    setFactReelFrais(isNaN(value) ? '' : value); // Assurez-vous que la valeur reste vide si la conversion échoue
    setFactReelFraisError('');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{ margin: '20px', padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Gestion des Natures</Typography>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>Ajouter une nature</Button>
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Libellé</TableCell>
                <TableCell>Méthode de facturation</TableCell>
                <TableCell>Code INGC</TableCell>
                <TableCell>Montant réel des pièces</TableCell>
                <TableCell>Montant réel de la main-d'œuvre</TableCell>
                <TableCell>Montant réel des frais</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {natures.map(nature => (
                <TableRow key={nature.code}>
                  <TableCell>{nature.code}</TableCell>
                  <TableCell>{nature.libelle}</TableCell>
                  <TableCell>{nature.facturationMethode}</TableCell>
                  <TableCell>{nature.ingcCode}</TableCell>
                  <TableCell>{nature.facturationReellePieces}</TableCell>
                  <TableCell>{nature.facturationReelleMO}</TableCell>
                  <TableCell>{nature.facturationReelleFrais}</TableCell>
                  <TableCell>
                    <EditIcon onClick={() => handleEditNature(nature)} color="primary"/>
                    <DeleteIcon onClick={() => setDeleteCode(nature.code)} color="secondary"/>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth={true} maxWidth="sm">
  <DialogTitle>{editCode ? "Modifier la Nature" : "Ajouter une Nature"}</DialogTitle>
  <DialogContent dividers>
    <Grid container spacing={2}> 
      <Grid item xs={6}> 
        <TextField
          label="Libellé"
          value={libelle}
          onChange={handleLibelleChange}
          fullWidth
          margin="normal"
          error={!!libelleError}
          helperText={libelleError}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Méthode de facturation"
          value={factMethode}
          onChange={handleFactMethodeChange}
          fullWidth
          margin="normal"
          error={!!factMethodeError}
          helperText={factMethodeError}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Code INGC"
          value={ingcCode}
          onChange={handleIngcCodeChange}
          fullWidth
          margin="normal"
          error={!!ingcCodeError}
          helperText={ingcCodeError}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Montant réel des pièces"
          value={factReelPieces}
          onChange={handleFactReelPiecesChange}
          fullWidth
          margin="normal"
          error={!!factReelPiecesError}
          helperText={factReelPiecesError}
        />
      </Grid>
      <Grid item xs={6}> 
        <TextField
          label="Montant réel de la main-d'œuvre"
          value={factReelMo}
          onChange={handleFactReelMoChange}
          fullWidth
          margin="normal"
          error={!!factReelMoError}
          helperText={factReelMoError}
        />
      </Grid>
      <Grid item xs={6}> 
        <TextField
          label="Montant réel des frais"
          value={factReelFrais}
          onChange={handleFactReelFraisChange}
          fullWidth
          margin="normal"
          error={!!factReelFraisError}
          helperText={factReelFraisError}
        />
      </Grid>
    </Grid>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDialog}>Annuler</Button>
    <Button onClick={editCode ? handleUpdateNature : handleAddNature}>{editCode ? "Modifier" : "Ajouter"}</Button>
  </DialogActions>
</Dialog>

      {/* Boîte de dialogue de confirmation de suppression */}
      <Dialog open={!!deleteCode} onClose={() => setDeleteCode(null)}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cette nature ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteCode(null)}>Annuler</Button>
          <Button onClick={() => {
            handleDeleteNature(deleteCode);
            setDeleteCode(null);
          }}color="error">Confirmer</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default NaturePage;
