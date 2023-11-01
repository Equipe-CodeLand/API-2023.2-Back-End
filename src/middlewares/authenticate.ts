/* funções que têm acesso ao objeto de solicitação (req), ao objeto de resposta (res) e à próxima função de middleware no ciclo de 
solicitação/resposta da aplicação. 
Fazer a autenticação (login) aqui*/

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Usuario from "../entities/usuario.entity";
import { getRepository } from "typeorm";
import Cliente from "../entities/cliente.entity";
import Atendente from "../entities/atendente.entity";
import Administrador from "../entities/administador.entity";
import { AppDataSource } from "../config/data-source";
import { jwtDecode } from "jwt-decode";

export function decodeJWT(data: string) {
    const decodedToken = jwtDecode(data);
    return decodedToken
  }

export async function getUserRoles(usuario: Usuario) {
  const clienteRepository = AppDataSource.getRepository(Cliente);
  const atendenteRepository = AppDataSource.getRepository(Atendente);
  const administradorRepository = AppDataSource.getRepository(Administrador);

  const cliente = await clienteRepository.findOne({ where: { usuario: usuario } });
  const atendente = await atendenteRepository.findOne({ where: { usuario: usuario } });
  const administrador = await administradorRepository.findOne({ where: { usuario: usuario } });

  if (cliente) {
    return "Cliente";
  } else if (atendente) {
    return "Atendente";
  } else if (administrador) {
    return "Administrador";
  }

  return "Sem cargo";
}

export async function generateAuthToken(usuario: Usuario) {
  const payload = {
    userId: usuario.id,
    email: usuario.email,
    cargo: await getUserRoles(usuario),
  };

  return jwt.sign(payload, "decodeToken", { expiresIn: "1h" });
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, 'decodeToken') as { userId: number; email: string; cargo: string };
    
    (req as any).user = decoded;

    next();
  } catch (error) {
    console.error(error);
    
    res.status(401).json({ error: 'Token inválido' });
  }
};

export const authorize = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user.cargo;

    if (!requiredRoles.includes(userRole)) {

      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    
    next();
  };
};

