const {StageSize} = require('../../../Model/decore/Decor');

const Update = async(req, res) => {
    const {id} = req.params;
    const {name, cost,description} = req.body
    const stageImage = req.files['stageImage'];
    try {
        const stageSize = await StageSize.findById(id);
        if(!stageSize){
            return res.status(400).json({status: 400, message: "Stage Dimention not found"});
        }
        if(name) stageSize.name = name;
        if(cost) stageSize.cost = cost;
        if(description) stageSize.description = description;
        if(stageImage){
            stageSize.stageImageName = stageImage[0].originalname;
            stageSize.stageImagePath = stageImage[0].path
        }
        await stageSize.save();
        res.status(200).json({status: 200, message: "Stage Dimention updated", stageSize})
    } catch (error) {
        console.error("Error updating Stage Dimentions:", error);
        res.status(500).json({message: "Internal Server Error", error: error});
    }
}

module.exports = Update;