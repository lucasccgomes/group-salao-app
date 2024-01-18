const express = require('express');
const router = express.Router();
const Busboy = require('busboy');
const aws = require('../services/aws');
const Salao = require('../models/salao');
const Arquivo = require('../models/arquivo');
const Servico = require('../models/servico');

console.log("Configurando rotas de serviço...");

//Creator
router.post('/', async (req, res) => {

    console.log("Requisição POST recebida em /servico");

    let busboy = new Busboy({ headers: req.headers });
    busboy.on('finish', async () => {
        try {

            console.log("Processando requisição POST em /servico");

            const { salaoId, servico } = req.body;
            let errors = [];
            let arquivos = [];


            console.log(req.files)
            if (req.files && Object.keys(req.files).length > 0) {
                for (let key of Object.keys(req.files)) {
                    console.log(key)
                    const file = req.files[key];
                    console.log(file)

                    const nameParts = file.name.split('.');
                    const fileName = `${new Date().getTime()}.${nameParts[nameParts.length - 1]
                        }`;
                    const path = `servicos/${salaoId}/${fileName}`;

                    const response = await aws.uploadToS3(file, path)

                    if (response.error) {
                        errors.push({ error: true, message: response.message })
                    } else {
                        arquivos.push(path);
                    }
                }
            }

            if (errors.length > 0) {

                console.log("Finalizando processamento da requisição POST em /servico");

                res.json(errors[0]);
                return false;
            }
            //Criação de serviços
            let jsonServico = JSON.parse(servico);
            const servicoCadastrado = await Servico(jsonServico).save();

            //Criação de arquivos
            arquivos = arquivos.map(arquivo => ({
                referenciaId: servicoCadastrado._id,
                model: 'Servico',
                caminho: arquivo,
            }));

            await Arquivo.insertMany(arquivos)
            res.json({ servico: servicoCadastrado, arquivos });

        } catch (err) {

            console.error("Erro na rota POST /servico:", err.message);

            res.json({ error: true, message: err.message });
        }
    });
    req.pipe(busboy);
});

//Update
router.put('/:id', async (req, res) => {

    console.log("Requisição POST recebida em /servico");

    let busboy = new Busboy({ headers: req.headers });
    busboy.on('finish', async () => {
        try {

            console.log("Processando requisição POST em /servico");

            const { salaoId, servico } = req.body;
            let errors = [];
            let arquivos = [];


            console.log(req.files)
            if (req.files && Object.keys(req.files).length > 0) {
                for (let key of Object.keys(req.files)) {
                    console.log(key)
                    const file = req.files[key];
                    console.log(file)

                    const nameParts = file.name.split('.');
                    const fileName = `${new Date().getTime()}.${nameParts[nameParts.length - 1]
                        }`;
                    const path = `servicos/${salaoId}/${fileName}`;

                    const response = await aws.uploadToS3(file, path)

                    if (response.error) {
                        errors.push({ error: true, message: response.message })
                    } else {
                        arquivos.push(path);
                    }
                }
            }

            if (errors.length > 0) {

                console.log("Finalizando processamento da requisição POST em /servico");

                res.json(errors[0]);
                return false;
            }
            //Criação de serviços
            const jsonServico = JSON.parse(servico);
            await Servico.findByIdAndUpdate(req.params.id, jsonServico);

            //Criação de arquivos
            arquivos = arquivos.map(arquivo => ({
                referenciaId: req.params.id,
                model: 'Servico',
                caminho: arquivo,
            }));

            await Arquivo.insertMany(arquivos)
            res.json({ error: false });

        } catch (err) {

            console.error("Erro na rota POST /servico:", err.message);

            res.json({ error: true, message: err.message });
        }
    });
    req.pipe(busboy);
});

//Delet
router.post('/remove-arquivo', async (req, res) => {
    try {
        const { id } = req.body;

        await aws.deleteFileS3(id);

        await Arquivo.findOneAndDelete({
            caminho: id,
        });

        res.json({ error: false });

    } catch (err) {
        res.json({ error: true, message: err.message });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await Servico.findByIdAndUpdate(id, { status: 'E' })
        res.json({ error: false });

    } catch (err) {
        res.json({ error: true, message: err.message });
    }
})

router.get('/salao/:salaoId', async (req, res) => {
    try {
        let servicosSalao = [];
        const servicos = await Servico.find({
            salaoId: req.params.salaoId,
            status: { $ne: 'E' },
        });

        for (let servico of servicos) {
            const arquivos = await Arquivo.find({
                model: 'Servico',
                referenciaId: servico._id
            });
            servicosSalao.push({ ...servico._doc, arquivos})
        }

        res.json({
            servicos: servicosSalao,
        })
    } catch (err) {
        res.json({ error: true, message: err.message })
    }
})

module.exports = router