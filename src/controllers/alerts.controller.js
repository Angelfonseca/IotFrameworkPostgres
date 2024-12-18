import Alert from "../models/alerts.model.js";

const getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.findAll();
        return res.status(200).json(alerts);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const createAlert = async (req, res) => {
    try {
        const alert = await Alert.create(req.body);
        return res.status(201).json(alert);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const updateAlert = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const alert = await Alert.findByPk(id);
        if (!alert) {
            return res.status(404).json({ error: "Alert not found" });
        }
        await alert.update(updateData);
        return res.status(200).json(alert);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const deleteAlert = async (req, res) => {
    const { id } = req.params;
    try {
        const alert = await Alert.findByPk(id);
        if (!alert) {
            return res.status(404).json({ error: "Alert not found" });
        }
        await alert.destroy();
        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const patchAlert = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const alert = await Alert.findByPk(id);
        if (!alert) {
            return res.status(404).json({ error: "Alert not found" });
        }
        await alert.update(updateData);
        return res.status(200).json(alert);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export default { getAlerts, createAlert, updateAlert, deleteAlert, patchAlert };