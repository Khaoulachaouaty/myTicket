import "./EqFamille.css";
import {
  Box,
  Button,
  DialogTitle,
  Stack,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { alpha } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Alert from "@mui/material/Alert";
import { useForm } from "react-hook-form";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import Header from "../../admin/components/Header";
//import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useEffect } from "react";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { adminService } from "../../services/equipement_service";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "30%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100px", // Largeur fixe de l'entrée de texte
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const EqFamille = () => {
  const theme = useTheme();
  const color = theme.palette.mode === "light" ? "#5183a6" : "#a4c0d5"; // Modifier les couleurs en fonction du mode

  const cardStyles = {
    backgroundColor: theme.palette.mode === "light" ? "#f3f8fb" : "#292929",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "16px",
    marginBottom: "16px",
    transition: "transform 0.2s ease-in-out",
    width: "300px", // Largeur des cartes
    border: "none", // Éliminer le contour
  };

  const cardContentStyles = {
    display: "flex",
    flexDirection: "column",
  };
  
  const libelleStyles = {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "8px",
  };
  
  const codeStyles = {
    fontSize: "1rem",
    color: theme.palette.mode === "light" ? "#666666" : "#e7e7e7",
  };

  // State pour les champs de la boîte de dialogue d'ajout
  const [eqfa_code, setCode] = React.useState("");
  const [eqfa_libelle, setLibelle] = React.useState("");

  const checkIfCodeExists = async (code) => {
    try {
      const response = await axios.get(
        `http://localhost:8086/tickets/api/getbyeqfacode/${code}`
      );
      console.log("code existe", response.data.exists);
      return response.data.exists;
    } catch (error) {
      console.error("Error checking if code exists:", error);
      return false;
    }
  };

  const handleSaveDialog = async (e) => {
    e.preventDefault();

    if (!eqfa_code.trim() || !eqfa_libelle.trim()) {
      console.error("Le code et le libellé ne peuvent pas être vides.");
      return; // Sortir de la fonction si le code ou le libellé est vide
    }
    // Vérifier si le code existe déjà dans la base de données
    const codeExists = await checkIfCodeExists(eqfa_code);
    console.log("Code exists:", codeExists); // Vérifier la valeur de codeExists
    if (codeExists) {
      console.error("Le code saisi existe déjà dans la base de données.");
      return; // Sortir de la fonction si le code existe déjà
    }
    // Le code n'existe pas encore, ajouter la nouvelle entrée
    const eqf = {
      eqfaCode: eqfa_code,
      eqfaLibelle: eqfa_libelle,
      dtCre: new Date(),
    };
    adminService
      .saveFamille(eqf)
      .then((response) => {
        console.log(response);
        setFamilles((prevFamilles) => [...prevFamilles, response.data]); // Ajouter les nouvelles données à la fin du tableau
        setCode("");
        setLibelle("");
        loadFamille();
        setOpenDialog(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
    reset();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [openDialog, setOpenDialog] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [confirmUpdateOpen, setConfirmUpdateOpen] = React.useState(false);
  const [deleteItem, setDeleteItem] = React.useState(null);

  const onSubmit = (data) => {
    console.log(data);
    setOpenSnackbar(true);
    setOpenDialog(false);
  };

  const [updated, setUpdated] = React.useState();

  const handleClickMenu = (event, famille) => {
    setAnchorEl(event.currentTarget);
    setDeleteItem(famille.eqfaCode); // Stocker l'objet complet
    setUpdated(famille);
    console.log("famille", famille);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDeleteConfirmOpen = (event, selectedItem) => {
    console.log("selectedItem*******", selectedItem);
    setConfirmDeleteOpen(true);
    console.log("selectedItem", selectedItem.eqfaCode);
    handleCloseMenu();
  };

  const handleDeleteConfirmClose = () => {
    setConfirmDeleteOpen(false);
    handleCloseMenu();
  };

  const handleDeleteConfirm = async (deleteItem) => {
    console.log(deleteItem);
    try {
      await adminService.deleteFamille(deleteItem);
      loadFamille();
      setConfirmDeleteOpen(false);
      setDeleteItem(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  // State pour les champs de la boîte de dialogue de modification
  const [codeValue, setCodeValue] = React.useState("");
  const [libelleValue, setLibelleValue] = React.useState("");
  const [loginCreValue] = React.useState("");
  const [loginMajValue] = React.useState("");
  const [dtCreation, setDtCreationValue] = React.useState(null);

  const handleUpdateConfirmClose = () => {
    setConfirmUpdateOpen(false);
    handleCloseMenu();
  };

  const handleUpdateConfirmOpen = () => {
    setConfirmUpdateOpen(true);
    // @ts-ignore
    setDeleteItem(updated.eqfaCode); // Stocker l'objet complet
    // @ts-ignore
    setCodeValue(updated.eqfaCode); // Pré-remplir les champs de saisie avec les valeurs de l'élément sélectionné
    // @ts-ignore
    setLibelleValue(updated.eqfaLibelle);
    // @ts-ignore
    setDtCreationValue(updated.dtCre);
    // @ts-ignore
    console.log("put", updated.eqfaCode);
    // @ts-ignore
    console.log(updated.eqfaLibelle);
  };

  const handleUpdateItem = async () => {
    try {
      const updatedItem = {
        eqfaLibelle: libelleValue,
        loginMaj: loginMajValue,
        loginCre: loginCreValue,
        eqfaCode: codeValue,
        dtMaj: new Date(),
        dtCre: dtCreation,
      };
      if (!libelleValue.trim()) {
        console.error("Le code et le libellé ne peuvent pas être vides.");
        return; // Sortir de la fonction si le libellé est vide
      }
      await adminService.updateFamille(updatedItem);
      loadFamille();
      setConfirmUpdateOpen(false);
      handleCloseMenu();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const [familles, setFamilles] = React.useState([]);
  const [searchResults, setSearchResults] = React.useState([]);
  const [searchInputValue, setSearchInputValue] = React.useState("");

  useEffect(() => {
    loadFamille();
  }, []);

  const loadFamille = async () => {
    try {
      const response = await adminService.getAllFamilles();
      setFamilles(response.data);
      setSearchResults(response.data); // Initialiser searchResults avec toutes les données
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const Filter = async (event) => {
    const libelle = event.target.value.toLowerCase();
    setSearchInputValue(libelle); // Mettre à jour la valeur de recherche
    try {
      if (libelle.trim() === "") {
        // Si le champ de recherche est vide, charger tous les équipements
        await loadFamille();
      } else {
        const response = await adminService.FilterFamille(libelle);
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "calc(100vh - 64px)",
      }}
    >
     <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  }}
>
  <Typography
    color={theme.palette.mode === "light" ? "#aebfcb" : "#fff"}
    fontSize="30px"
    margin="5px"
    sx={{
      fontWeight: 500,
    }}
  >
    Equipements Famille
  </Typography>
  <React.Fragment>
    <Button
      variant="outlined"
      onClick={handleClickOpen}
      sx={{
        color: theme.palette.mode === "light" ? "#458783" : "#daedea",
        borderColor:
          theme.palette.mode === "light" ? "#458783" : "#daedea",
        "&:hover": {
          color:
            theme.palette.mode === "light" ? "#366b6a" : "#b5dad5",
          borderColor:
            theme.palette.mode === "light" ? "#366b6a" : "#b5dad5",
        },
      }}
    >
      Ajouter
    </Button>
    {/* Dialog pour ajouter un équipement */}
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
      <DialogContent>
        <DialogContentText>
          <Header
            title="CRÉER UN EQUIPEMENT FAMILLE"
            subTitle="Créer un nouveau équipement famille"
          />
        </DialogContentText>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          noValidate
          autoComplete="off"
        >
          {/* Les champs de texte */}
          <Stack sx={{ gap: 2 }} direction="row">
            <TextField
              error={Boolean(errors.code)}
              helperText={
                errors.code ? "Ce champ est obligatoire" : null
              }
              {...register("code", { required: true, maxLength: 10 })}
              sx={{ flex: 1 }}
              label="Code"
              variant="outlined"
              value={eqfa_code}
              onChange={(e) => setCode(e.target.value)}
            />
            <TextField
              error={Boolean(errors.libelle)}
              helperText={
                errors.libelle ? "Ce champ est obligatoire" : null
              }
              {...register("libelle", {
                required: true,
                maxLength: 30,
              })}
              sx={{ flex: 1 }}
              label="Libellé"
              variant="outlined"
              value={eqfa_libelle}
              onChange={(e) => setLibelle(e.target.value)}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(e) => {
            handleSubmit(onSubmit)(e);
            handleSaveDialog(e);
          }}
        >
          Ajouter
        </Button>
        <Button
          onClick={() => setOpenDialog(false)}
          sx={{ color: color }}
        >
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  </React.Fragment>
</Box>

      <Box
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.background.main
              : theme.palette.background.main,
          padding: "20px",
          borderRadius: "15px",
        }}
      >
        <Box
          sx={{
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.background.main
                : theme.palette.background.main,
            padding: "20px",
            borderRadius: "15px",
            display: "flex",
            alignItems: "center", // Centrer verticalement
            justifyContent: "space-between", // Espacer les éléments horizontalement
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
                Liste des equipements famille
              </Box>
            }
            subTitle=""
          />
          <Search
            sx={{
              backgroundColor:
                theme.palette.mode === "light" ? "#f3f8fb" : "6d6d6d",
              width: "200px", // Ajuster la largeur du composant de recherche
            }}
          >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Chercher…"
              inputProps={{ "aria-label": "search" }}
              value={searchInputValue || ""}
              onChange={Filter}
            />
          </Search>
        </Box>
      <Box sx={{ gap: 3 }} my={1}>
      <main className="flex">
        <section className="flex right-section " style={{ justifyContent: "flex-start" }}>
          {searchInputValue !== "" && searchResults.length === 0 && (
            <p>Aucun résultat trouvé pour `{searchInputValue}`</p>
          )}
          {searchResults.map((fa) => (
            <article key={`${fa.eqfaCode}`} className="card" style={cardStyles}>
            {/* Affichez les données de chaque famille dans les cartes */}
              <div
                style={{ position: "relative" }}
                className="box"
              >
                <div style={{ position: "absolute", top: "0", right: "0" }}>
                  <Button
                    id={`basic-button-${fa.eqfaCode}`}
                    aria-controls={`basic-menu-${fa.eqfaCode}`}
                    aria-haspopup="true"
                    aria-expanded={anchorEl ? "true" : undefined}
                    onClick={(event) => handleClickMenu(event, fa)}
                    endIcon={<MoreVertOutlinedIcon />}
                    sx={{ color: color }}
                  ></Button>

                  <Menu
                    id={`basic-menu-${fa.eqfaCode}`}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    MenuListProps={{
                      "aria-labelledby": `basic-button-${fa.eqfaCode}`,
                    }}
                  >
                    <MenuItem onClick={() => handleUpdateConfirmOpen()}>
                      Modifier
                    </MenuItem>
                    <MenuItem
                      onClick={(event) => handleDeleteConfirmOpen(event, fa)}
                    >
                      Supprimer
                    </MenuItem>
                  </Menu>
                </div>
                {/* Insérez ici les éléments de votre carte */}
                <div style={cardContentStyles} className="card-content">
                    <h2 style={libelleStyles} className="libelle">
                      {fa.eqfaLibelle}
                    </h2>
                    <p style={codeStyles} className="code">
                      Code: {fa.eqfaCode}
                    </p>
                  </div>
              </div>
            </article>
          ))}
        </section>
      </main>
      </Box>
      {/* Dialog pour la confirmation de suppression */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={handleDeleteConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Suppression</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer cet élément ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ color: color }}
            onClick={() =>
              handleDeleteConfirm(
                // @ts-ignore
                deleteItem
              )
            }
            autoFocus
          >
            Oui
          </Button>
          <Button onClick={handleDeleteConfirmClose} sx={{ color: color }}>
            Non
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour la confirmation de modification */}
      <Dialog
        open={confirmUpdateOpen}
        onClose={handleUpdateConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Modifier</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Modifier les champs suivants :
          </DialogContentText>
          {/* Les champs de saisie pré-remplis avec les valeurs de l'élément sélectionné */}
          <TextField
            fullWidth
            margin="normal"
            label="Code"
            variant="outlined"
            disabled={true}
            value={codeValue} // Utiliser une valeur vide si codeValue est nul
            onChange={(e) => setCodeValue(e.target.value)}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Libellé"
            variant="outlined"
            value={libelleValue}
            onChange={(e) => setLibelleValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateItem} sx={{ color: color }}>
            Modifier
          </Button>
          <Button onClick={handleUpdateConfirmClose} sx={{ color: color }}>
            Annuler
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour afficher le message de succès */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={openSnackbar} // Utiliser openSnackbar au lieu de open
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)} // Fermer le Snackbar lorsqu'il est cliqué
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          équipement ajouté avec succès
        </Alert>
      </Snackbar>
      
    </Box>
    </Box>
  
  );
};

export default EqFamille;
