import type { NextApiRequest, NextApiResponse } from 'next'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import type { LoginResposta } from '../../types/loginResposta';
import md5 from 'md5'
import { UsuarioModel } from '../../models/UsuarioModel';
import jwt from 'jsonwebtoken';
import { politicaCORS } from '../../middlewares/politicaCORS';

const endpointLogins = async (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg | any>
) => {

    const { MINHA_CHAVE_JWT } = process.env;
    if (!MINHA_CHAVE_JWT) {
        return res.status(500).json({ erro: 'ENV JWT não informada' })
    }

    if (req.method === 'POST') {
        const { login, senha } = req.body;


        const usuarioEncontrados = await UsuarioModel.find({ email: login, senha: md5(senha) });
        if (usuarioEncontrados && usuarioEncontrados.length > 0) {
            const usuarioEncontrado = usuarioEncontrados[0];

            const token = jwt.sign({ _id: usuarioEncontrado._id }, MINHA_CHAVE_JWT)
            return res.status(200).json({
                nome: usuarioEncontrado.nome,
                email: usuarioEncontrado.email,
                token
            })
        }
        return res.status(401).json({ erro: 'Usuário ou senha não encontrados' });
    }
    return res.status(405).json({ erro: 'Metodo informado não é válido' })
}

export default politicaCORS(conectarMongoDB(endpointLogins));