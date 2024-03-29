module.exports = (sequelize, DataTypes) => {
    const photos = sequelize.define("photos", {
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    })

    return photos
}