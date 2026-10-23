
import {
    criarUsuario,
    autenticarUsuario,
    listarUsuarios,
    atualizarUsuario
} from "../usuarioService.js";

import jwt from "jsonwebtoken";

export async function cadastrarUsuario(req, res, next) {
    try {
        const { nome, email, senha, tipo } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                mensagem: "Nome, e-mail e senha são obrigatórios."
            });
        }

        if (senha.length < 8) {
            return res.status(400).json({
                mensagem: "A senha deve ter pelo menos 8 caracteres."
            });
        }

        const usuario = await criarUsuario({
            nome,
            email,
            senha,
            tipo: "operador"
        });

        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso.",
            usuario
        });
    } catch (erro) {
        if (erro.message === "Este e-mail já está cadastrado.") {
            return res.status(409).json({
                mensagem: erro.message
            });
        }

        next(erro);
    }
}

export async function loginUsuario(req, res, next) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: "E-mail e senha são obrigatórios."
            });
        }

        const usuario = await autenticarUsuario(email, senha);

        const token = jwt.sign(
            {
                id: usuario.id,
                tipo: usuario.tipo
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            mensagem: "Login realizado com sucesso.",
            token,
            usuario
        });
    } catch (erro) {
        if (erro.message === "E-mail ou senha inválidos.") {
            return res.status(401).json({
                mensagem: erro.message
            });
        }

        next(erro);
    }
}

export async function consultarUsuarios(req, res, next) {
    try {
        const usuarios = await listarUsuarios();

        return res.status(200).json(usuarios);
    } catch (erro) {
        next(erro);
    }
}

export async function editarUsuario(req, res, next) {
    try {
        const id = Number(req.params.id);
        const { nome, email, tipo } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "ID inválido."
            });
        }

        if (!nome || !email || !tipo) {
            return res.status(400).json({
                mensagem: "Nome, e-mail e tipo são obrigatórios."
            });
        }

        if (!["operador", "administrador"].includes(tipo)) {
            return res.status(400).json({
                mensagem: "Tipo de usuário inválido."
            });
        }

        const usuario = await atualizarUsuario(id, {
            nome,
            email,
            tipo
        });

        return res.status(200).json({
            mensagem: "Usuário atualizado com sucesso.",
            usuario
        });
    } catch (erro) {
        if (erro.code === "P2025") {
            return res.status(404).json({
                mensagem: "Usuário não encontrado."
            });
        }

        if (erro.code === "P2002") {
            return res.status(409).json({
                mensagem: "Este e-mail já está cadastrado."
            });
        }

        next(erro);
    }
}
