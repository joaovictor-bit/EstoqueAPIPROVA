
import { Router } from "express";

import {
    cadastrarUsuario,
    loginUsuario,
    consultarUsuarios,
    editarUsuario
} from "../controllers/usuariocontroller.js";

const router = Router();

router.post("/", cadastrarUsuario);
router.post("/login", loginUsuario);
router.get("/", consultarUsuarios);
router.put("/:id", editarUsuario);

export default router;
