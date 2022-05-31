import type {NextApiRequest, NextApiResponse} from 'next'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { UsuarioModel } from '../../models/UsuarioModel'

const pesquisaEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any[]>) =>{

    try{
        if(req.method === 'GET'){
            const {filtro} = req.query

            if(filtro && filtro.length < 2){
                return res.status(400).json({erro: 'Favor informar pelo menos 2 caracteres para a busca'})
            }

            const usuariosEncontrados = await UsuarioModel.find({
                $or: [{ nome: {$regex: filtro, $options: 'i'}}, 
                {email: {$regex: filtro, $options: 'i'}}]
            })

            return res.status(200).json(usuariosEncontrados)
        }
        return res.status(405).json({erro: 'Metodo informaod não é válido'})
    }catch(e){
        console.log(e)
        return res.status(500).json({erro: 'Não foi possível buscar usuário' + e})
    }
}

export default validarTokenJWT(conectarMongoDB(pesquisaEndpoint))