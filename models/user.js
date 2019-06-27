'use strict';

const nanoid = require('nanoid');
const bcrypt = require('bcrypt')

const err404 = {
    status : 404,
    reason : 'invalid username or password given'
};

const err415 = {
    status : 415,
    reason : 'request can not be satisfied'
};

const err5xx = {
    status : 500,
    reason : 'can not process request, internal server error'
};

const hashPassword = async user => {
  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);
}

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username : {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        resetKey : {
            type : DataTypes.STRING
        },
        verified : {
            type : DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue : false
        },
    },{
        hooks: {
            beforeCreate: hashPassword,
            beforeUpdate: hashPassword
        }
	});

    User.prototype.validPassword = async function(password) {
        return await bcrypt.compare(password, this.password);
    }

    User.prototype.authCheck = (username, password) => {
        const salt = bcrypt.genSaltSync();
        const passHash = bcrypt.hashSync(password, salt);
        const user = User.findOne({
            where: {
                password: passHash,
                username: username
            }
        });

        return !!user;
    }

    User.prototype.genResetKey = async () => {
        let result = await sequelize.transaction( async (t) => {
            this.update({
                resetkey : nanoid(32),
            }, { transaction : t, logging: q => { console.log(q); } });
        });
        return result.resetKey;
    }

    User.prototype.changePassword = async (oldPass, newPass) => {
        if (!this.validPassword(oldPass)) {
            throw new Error("old password does not match");
        }
        this.password = newPass;
        return await this.save();
    }

    User.prototype.resetPassword = async (resetKey, newPass) => {
        if (this.resetKey !== resetKey) {
            throw new Error("reset key invalid");
        }
        // to prevent reply issue
        this.resetKey = nanoid(32);
        this.password = newPass;
        return await this.save();
    }
    
    return User;
};