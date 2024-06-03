import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { pieceRechangeService } from "../../services/pieceRechange_service";
import { adminService } from "../../services/equipement_service";
import { articleService } from "../../services/article_service";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete";

const PieceRechangePage = () => {
  const [piecesRechange, setPiecesRechange] = useState([]);
  const [article, setArticle] = useState(null);
  const [equipement, setEquipement] = useState(null);
  const [quantite, setQuantite] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [deletePieceId, setDeletePieceId] = useState(null);
  const [articles, setArticles] = useState([]);
  const [equipements, setEquipements] = useState([]);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [qte, setQte] = useState(0);
  const [equipementSearch, setEquipementSearch] = useState("");
  const [articleError, setArticleError] = useState(false);
  const [equipementError, setEquipementError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [errorSnackbarMessage, setErrorSnackbarMessage] = useState("");

  useEffect(() => {
    loadPiecesRechange();
    loadArticle();
    loadEquipement();
  }, []);

  const loadPiecesRechange = async () => {
    try {
      const response = await pieceRechangeService.getAllPieceRechange();
      setPiecesRechange(response.data);
    } catch (error) {
      console.error("Error fetching piece de rechange data:", error);
    }
  };

  const loadArticle = async () => {
    try {
      const response = await articleService.getAllArticles();
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching article options:", error);
    }
  };

  const loadEquipement = async () => {
    try {
      const response = await adminService.getAllEquipements();
      setEquipements(response.data);
    } catch (error) {
      console.error("Error fetching equipement options:", error);
    }
  };

  const handleAddPieceRechange = async () => {
    if (!article || !equipement) {
      setArticleError(!article);
      setEquipementError(!equipement);
      return;
    }

    const pieceExists = piecesRechange.some(
      piece =>
        piece.article.codeArticle === article.codeArticle &&
        piece.equipement.eqptCode === equipement.eqptCode
    );

    if (pieceExists) {
      setErrorSnackbarMessage("Cette pièce avec cet équipement et cet article existe déjà.");
      setErrorSnackbarOpen(true);
      return;
    }

    const piece = {
      id: {
        codeArticle: article.codeArticle,
        eqptCode: equipement.eqptCode,
      },
      eqprQte: quantite,
      equipement: equipement,
      article: article,
    };
    try {
      await pieceRechangeService.addPieceRechange(piece);
      clearForm();
      setOpenDialog(false);
      loadPiecesRechange();
      setSnackbarMessage("Pièce ajoutée avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding piece de rechange:", error);
    }
  };

  const handleEditPiece = (piece) => {
    setSelectedPiece(piece);
    setQte(piece.eqprQte);
    setUpdateDialogOpen(true);
  };

  const handleUpdatePiece = async (event) => {
    event.preventDefault();
    const updatedPiece = {
      id: {
        eqptCode: selectedPiece.equipement.eqptCode,
        codeArticle: selectedPiece.article.codeArticle,
      },
      eqprQte: qte,
      equipement: selectedPiece.equipement,
      article: selectedPiece.article,
      eqprValeurFrequence: selectedPiece.eqprValeurFrequence,
      eqprUnitFrequence: selectedPiece.eqprValeurFrequence,
    };
    try {
      await pieceRechangeService.updatePieceRechange(updatedPiece);
      setUpdateDialogOpen(false);
      loadPiecesRechange();
      setSnackbarMessage("Pièce mise à jour avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating piece de rechange:", error);
    }
  };

  const handleDeletePieceRechange = async (id) => {
    try {
      await pieceRechangeService.deletePieceRechange(id);
      loadPiecesRechange();
      setSnackbarMessage("Pièce supprimée avec succès");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting piece de rechange:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    clearForm();
  };

  const closeUpdateDialog = () => {
    setUpdateDialogOpen(false);
    setSelectedPiece(null);
    setQte(1);
  };

  const clearForm = () => {
    setArticle(null);
    setEquipement(null);
    setQuantite(1);
    setArticleError(false);
    setEquipementError(false);
  };

  return (
    <div style={{ margin: "20px", padding: "20px",  minHeight: "83vh", }}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={6}>
          <Typography variant="h4" gutterBottom>
            Gestion des Pièces de Rechange
          </Typography>
        </Grid>
        <Grid item xs={3} />
        <Grid item xs={3}>
          <TextField
            label="Rechercher Equipement"
            size="small"
            variant="outlined"
            value={equipementSearch}
            onChange={(e) => setEquipementSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
        Ajouter une pièce
        </Button>
      </div>
      <Grid container spacing={2}>
        {equipements.map(
          (equipement) =>
            equipement.eqptDesignation
              .toLowerCase()
              .includes(equipementSearch.toLowerCase()) && (
              <Grid item xs={12} key={equipement.eqptCode}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      {equipement.eqptDesignation}
                    </Typography>
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                      <TableContainer
                        component={Paper}
                        sx={{ backgroundColor: "#f7f8f8" }}
                      >
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Article</TableCell>
                              <TableCell>Quantité</TableCell>
                              <TableCell>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {piecesRechange
                              .filter(
                                (piece) =>
                                  piece.equipement.eqptCode ===
                                  (equipement
                                    ? equipement.eqptCode
                                    : equipements.find(
                                        (e) =>
                                          e.eqptDesignation === equipementSearch
                                      )?.eqptCode)
                              )
                              .map((piece) => (
                                <TableRow key={piece.id}>
                                  <TableCell>
                                    {piece.article.nomArticle}
                                  </TableCell>
                                  <TableCell>{piece.eqprQte}</TableCell>
                                  <TableCell>
                                    <IconButton
                                      onClick={() => handleEditPiece(piece)}
                                      aria-label="modifier"
                                      color="secondary"
                                    >
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton
                                      onClick={() =>
                                        setDeletePieceId(piece.id)
                                      }
                                      color="secondary"
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            )
        )}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Ajouter une Pièce de Rechange</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                options={equipements}
                getOptionLabel={(option) => option.eqptDesignation}
                value={equipement}
                onChange={(event, value) => {
                  setEquipement(value);
                  setEquipementError(!value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sélectionner Equipement"
                    error={equipementError}
                    helperText={equipementError ? "Équipement requis" : ""}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={articles}
                getOptionLabel={(option) => option.nomArticle}
                onChange={(event, newValue) => {
                  setArticle(newValue);
                  setArticleError(!newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sélectionner Article"
                    error={articleError}
                    helperText={articleError ? "Article requis" : ""}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Quantité"
                type="number"
                value={quantite}
                onChange={(e) => setQuantite(parseFloat(e.target.value))}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleAddPieceRechange}>Ajouter</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={updateDialogOpen} onClose={closeUpdateDialog}>
        <DialogTitle>Modifier la quantité</DialogTitle>
        <DialogContent>
          <form onSubmit={handleUpdatePiece}>
            <Grid container spacing={2} my={1}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Quantité"
                  variant="outlined"
                  type="number"
                  value={qte}
                  onChange={(e) => setQte(parseFloat(e.target.value))}
                />
              </Grid>
              <Grid
                item
                xs={12}
                container
                justifyContent="flex-end"
                spacing={2}
              >
                <Grid item>
                  <Button
                    onClick={closeUpdateDialog}
                    variant="outlined"
                    color="secondary"
                  >
                    Annuler
                  </Button>
                </Grid>
                <Grid item>
                  <Button type="submit" variant="contained" color="primary">
                    Modifier
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletePieceId} onClose={() => setDeletePieceId(null)}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cette pièce de rechange ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletePieceId(null)}>Annuler</Button>
          <Button
            onClick={() => {
              handleDeletePieceRechange(deletePieceId);
              setDeletePieceId(null);
            }}
            color="error"
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left"}}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%", ml:7 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left"}}
        open={errorSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setErrorSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setErrorSnackbarOpen(false)}
          severity="error"
          sx={{ width: "100%", ml:7 }}
        >
          {errorSnackbarMessage}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default PieceRechangePage;
