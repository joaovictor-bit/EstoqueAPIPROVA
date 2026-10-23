
import prisma from "./lib/prisma.js";
import bcrypt from "bcryptjs";

export async function criarUsuario(dados) {
    const { nome, email, senha, tipo } = dados;

    const usuarioExistente = await prisma.usuario.findUnique({
        where: { email }
    });

    if (usuarioExistente) {
        throw new Error("Este e-mail já está cadastrado.");
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    return await prisma.usuario.create({
        data: {
            nome,
            email,
            senhaHash,
            tipo: tipo || "operador"
        },
        select: {
            id: true,
            nome: true,
            email: true,
            tipo: true,
            criadoEm: true
        }
    });
}

export async function autenticarUsuario(email, senha) {
    const usuario = await prisma.usuario.findUnique({
        where: { email }
    });

    if (!usuario) {
        throw new Error("E-mail ou senha inválidos.");
    }

    const senhaValida = await bcrypt.compare(
        senha,
        usuario.senhaHash
    );

    if (!senhaValida) {
        throw new Error("E-mail ou senha inválidos.");
    }

    return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
    };
}

export async function listarUsuarios() {
    return await prisma.usuario.findMany({
        select: {
            id: true,
            nome: true,
            email: true,
            tipo: true,
            criadoEm: true,
            atualizadoEm: true
        },
        orderBy: {
            id: "asc"
        }
    });
}

export async function atualizarUsuario(id, dados) {
    const { nome, email, tipo } = dados;

    return await prisma.usuario.update({
        where: { id: Number(id) },
        data: {
            nome,
            email,
            tipo
        },
        select: {
            id: true,
            nome: true,
            email: true,
            tipo: true,
            atualizadoEm: true
        }
    });
}
