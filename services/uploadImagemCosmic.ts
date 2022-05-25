import multer from "multer";
import cosmicjs from "cosmicjs"

const {CHAVE_GRAVACAO_DOS_AVATARES,
    CHAVE_GRAVACAO_DOS_PUBLICACOES,
    BUCKET_AVATARES,
    BUCKET_PUBLICACOES} = process.env 

const Cosmic = cosmicjs()
const bucketAvatares = Cosmic.bucket({
    slug: BUCKET_AVATARES,
    write_hey: CHAVE_GRAVACAO_DOS_AVATARES
})

const bucketPublicacoes = Cosmic.bucket({
    slug: BUCKET_PUBLICACOES,
    write_hey: CHAVE_GRAVACAO_DOS_PUBLICACOES
})

const storage = multer.memoryStorage()
const updload = multer({storage: storage})

const uploadImagemCosmic = async(req: any) => {
    if(req?.file?.orgiginalname){
        const media_objetc = {
            orgiginalname: req.file.orgiginalname,
            Buffer: req.file.Buffer
        }

        if(req.url && req.url.includes('publicacao')){
            return await bucketPublicacoes.addMedia({media: media_objetc})
        }else{
            return await bucketAvatares.addMedia({media: media_objetc})
        }
    }
}

export {updload, uploadImagemCosmic}