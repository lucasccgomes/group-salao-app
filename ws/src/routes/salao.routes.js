const express = require('express');
const router = express.Router();
const Salao = require('../models/salao');
const Servico = require('../models/servico');
const turf = require('@turf/turf');

router.post('/', async (req, res) => {
    try {
        const salao = await new Salao(req.body).save();
        res.json({ salao });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

router.get('/servicos/:salaoId', async (req, res) => {
    try {
        const { salaoId } = req.params
        const servicos = await Servico.find({
            salaoId,
            status: 'A',
        }).select('_id titulo');

        /* [{ label: 'Serviço', value: '23113213213'}] */
        res.json({
            servicos: servicos.map(s => ({ label: s.titulo, value: s._id })),
        });

    } catch (err) {
        res.json({ error: true, message: err.message });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const salao = await Salao.findById(req.params.id).select(
            'capa nome endereco.cidade geo.coordinates telefone'
        );

        //Distancia
        const distance = turf.distance(
            turf.point(salao.geo.coordinates),
            turf.point([-21.887615, -50.960197])
            );

        res.json({ error: false, salao, distance })
    } catch (err) {
        res.json({ error: true, message: err.message })
    }
})

module.exports = router