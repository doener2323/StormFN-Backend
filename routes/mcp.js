const express = require('express');
const app = express();
const fs = require('fs');
const backendConfig = require('../config');
const random = require('random');

function checkAndCreateProfile(accountId) {
    if (!fs.existsSync(`${backendConfig.directory}/cache/profiles/${accountId}.json`)) {
        fs.copyFileSync(`${backendConfig.directory}/cache/templates/config.json`, `${backendConfig.directory}/cache/profiles/${accountId}.json`);
    };  
};

function loadConfig(accountId) {
    return JSON.parse(fs.readFileSync(`${backendConfig.directory}/cache/profiles/${accountId}.json`));
};

function loadProfile(profileId) {
    return JSON.parse(fs.readFileSync(`${backendConfig.directory}/cache/templates/profile_${profileId}.json`));
};

function saveConfig(directory, accountId, data) {
    fs.writeFileSync(`${directory}/cache/profiles/${accountId}.json`, JSON.stringify(data, null, 2));
}

// CREDITS TO AURORA & NEONITE FOR THIS IDEA
function createResponse(profileData, profileId, rvn) {
    return {
        'profileRevision': rvn ? (rvn - 0) + (1 - 0) : 1 || 1,
        'profileId': profileId,
        'profileChangesBaseRevision': Number(rvn) || 1,
        'profileChanges': [
            {
                changeType: 'fullProfileUpdate',
                profile: profileData
            }
        ],
        'profileCommandRevision': rvn ? (rvn - 0) + (1 - 0) : 1 || 1,
        'serverTime': new Date().toISOString(),
        'responseVersion': 1
    };
};

// Credits to Aurora
function createError(errorCode, errorMessage, numericErrorCode, originatingService, intent, messageVars) {
    return {
        'errorCode': errorCode,
        'errorMessage': errorMessage,
        'numericErrorCode': numericErrorCode,
        'originatingService': originatingService,
        'messageVars': messageVars || undefined,
        'intent': intent || 'prod'
    }
};

function createCreative(accountId, profile) {

    // Default

    profile.accountId = accountId;

    profile.created = new Date().toISOString();
    profile.updated = new Date().toISOString();

    profile.profileId = 'creative';

    return profile;
};

function createCommonCore(config, accountId, profile) {

    // Default

    profile._id = accountId;
    profile.accountId = accountId;

    profile.created = new Date().toISOString();
    profile.updated = new Date().toISOString();

    profile.profileId = 'athena';

    // V-Bucks

    profile.items['Currency:MtxPurchased'].quantity = config.vbucks;
    profile.items['Currency:MtxPurchased']

    // Stats

    profile.stats.attributes.mtx_affiliate = 'GKI';

    return profile;
};

function createCommonPublic(accountId, profile) {

    // Default

    profile.accountId = accountId;

    profile.created = new Date().toISOString();
    profile.updated = new Date().toISOString();

    profile.profileId = 'athena';

    return profile;
};

function createCollections(accountId, profile) {

    // Default
    profile.accountId = accountId;

    profile.created = new Date().toISOString();
    profile.updated = new Date().toISOString();

    profile.profileId = 'athena';

    return profile;
}

function createAthena(config, accountId, profile) {

    // Default

    profile._id = accountId;
    profile.accountId = accountId;

    profile.created = new Date().toISOString();
    profile.updated = new Date().toISOString();

    profile.version = 'doener#6969';
    profile.profileId = 'athena';

    // Loadout

    var locker = profile.items.sandbox_loadout.attributes.locker_slots_data.slots;

    locker.MusicPack.items[0] = config.MusicPack.ID;
    locker.MusicPack.activeVariants = config.MusicPack.Variants;

    locker.Character.items[0] = config.Character.ID;
    locker.Character.activeVariants = config.Character.Variants;          
    
    locker.Backpack.items[0] = config.Backpack.ID;
    locker.Backpack.activeVariants = config.Backpack.Variants;

    locker.SkyDiveContrail.items[0] = config.SkyDiveContrail.ID;
    locker.SkyDiveContrail.activeVariants = config.SkyDiveContrail.Variants;

    locker.Dance.items = config.Dance.ID;
    locker.Dance.activeVariants = config.Dance.Variants;
    
    locker.ItemWrap.items = config.ItemWrap.ID;
    locker.ItemWrap.activeVariants = config.ItemWrap.Variants;
    
    locker.Pickaxe.items[0] = config.Pickaxe.ID;
    locker.Pickaxe.activeVariants = config.Pickaxe.Variants;

    locker.LoadingScreen.items[0] = config.LoadingScreen.ID;
    locker.LoadingScreen.activeVariants = config.LoadingScreen.Variants;

    locker.Glider.items[0] = config.Glider.ID;
    locker.Glider.activeVariants = config.Glider.Variants;

    // Banner
    profile.items.sandbox_loadout.attributes.locker_slots_data.banner_icon_template = config.BannerIconTemplate;
    profile.items.sandbox_loadout.attributes.locker_slots_data.banner_color_template = config.BannerColorTemplate;

    profile.items.sandbox_loadout.attributes.locker_slots_data.slots = locker;

    // Stats

    var stats = profile.stats.attributes;

    stats.book_level = parseInt(config.level);
    stats.book_purchased = true;
    stats.lifetime_wins = random.int(1337, 666666);
    stats.level = parseInt(config.level, 10);
    stats.accountLevel = parseInt(config.level);
    stats.season_num = backendConfig.season_num; // CHANGE THIS WHENEVER THERE IS A NEW SEASON

    profile.stats.attributes = stats;

    // Favorite

    var items = profile.items;

	for (var item of Object.keys(config.favorites)) {
		items[item['id']].attributes.favorite = true;
	}

    profile.items = items;

    return profile;
};

app.post(
    '/fortnite/api/game/v2/profile/:accountId/client/:command', (req, res) => {

        const command = req.params.command;
        const accountId = req.params.accountId;

        const profileId = req.query.profileId;
        const rvn = req.query.rvn;
        
        checkAndCreateProfile(accountId);

        let config = loadConfig(accountId);
        let profile = loadProfile(profileId);

        switch (command) {

            case 'SetCosmeticLockerBanner':
                if(req.body.bannerIconTemplateName != 'None') {
                    config.BannerIconTemplate = req.body.bannerIconTemplateName
                };
                if(req.body.BannerColorTemplate != 'None') {
                    config.BannerColorTemplate = req.body.bannerColorTemplateName
                };
                saveConfig(backendConfig.directory, accountId, config);
                res.json(createResponse(createAthena(config, accountId, profile), profileId, rvn));
                break;

            case 'ClientQuestLogin':
            case 'QueryProfile':
                switch (profileId) {

                    case 'collections':
                        res.json(createResponse(createCollections(config, accountId, profile), profileId)).end();
                        break;

                    case 'athena':
                    case 'profile0':
                        res.json(createResponse(createAthena(config, accountId, profile), profileId)).end();
                        break;

                    case 'creative':
                        res.json(createResponse(createCreative(accountId, profile), profileId)).end();
                        break;

                    case 'common_core':
                        res.json(createResponse(createCommonCore(config, accountId, profile), profileId)).end();
                        break;

                    case 'common_public':
                        res.json(createResponse(createCommonPublic(accountId, profile), profileId)).end();
                        break;

                    case 'collection_book_schematics0':
                    case 'collection_book_people0':
                    case 'metadata':
                    case 'theater0':
                    case 'outpost0':
                    case 'metadata':
                        res.json(createResponse([], profileId));
                        break;

                    default:
                        res.json(createError(
                            'errors.com.epicgames.modules.profiles.operation_forbidden',
                            `Unable to find template configuration for profile ${req.query.profileId}`,
                            12813,
                            'fortnite',
                            'prod-live',
                            [req.query.profileId]
                        )
                    );
                    break;
                };
                break;

            case 'SetMtxPlatform':
                res.json(createResponse([{
                    'changeType': 'statModified',
                    'name': 'current_mtx_platform',
                    'value': req.body.platform
                }], profileId, rvn));
                break;

            case 'VerifyRealMoneyPurchase':
                res.json(createResponse(createCommonCore(config, accountId, profile)));
                break;

            case 'SetItemFavoriteStatusBatch':
                let index = 0;
                for (item of req.body.itemIds) {
                    if (req.body.itemFavStatus[index] === true) {
                        var isAlreadyFavorized = false;
                        for (item of config.favorites) {
                            if(item.id === req.body.itemIds[index]) {
                                isAlreadyFavorized = true;
                                break;
                            }
                        }
                        if (!isAlreadyFavorized)
                            {
                                config.favorites.push({id: req.body.itemIds[index]});
                            }
                    }
                    else {
                        var index2 = 0;
                        for (item of config.favorites) {
                            if (item.id === req.body.itemIds[index]) {
                                config.favorites.splice(index2, 1);
                                break;
                            }
                            index2 += 1
                        }
                    }
                    index += 1;
                }
                saveConfig(backendConfig.directory, accountId, config);
                res.json(createResponse(createAthena(config, accountId, profile), profileId, rvn));
                break;

            case 'SetCosmeticLockerSlot':
                const itemToSlot = req.body.itemToSlot;
                const indexSlot = req.body.slotIndex;
                const slotName = req.body.category; 
                const variantUpdates = req.body.variantUpdates;

                switch (slotName) {

                    case 'Character':
                    case 'Backpack':
                    case 'Pickaxe':
                    case 'Glider':
                    case 'SkyDiveContrail':
                    case 'MusicPack':
                    case 'LoadingScreen':
                        config[slotName].ID = itemToSlot;
                        config[slotName].Variants = [{'variants': variantUpdates}];

                    case 'Dance':
                        config[slotName].ID[indexSlot] = itemToSlot;
                        config[slotName].Variants[indexSlot] = [{'variants': variantUpdates}];

                    case 'ItemWrap':
                        if (indexSlot != -1) {
                            config[slotName].ID[indexSlot] = itemToSlot;
                            config[slotName].Variants[indexSlot] = [{'variants': variantUpdates}];
                        }
                        // APPLY ALL
                        else {
                            config[slotName].ID[0] = itemToSlot;
                            config[slotName].Variants[0] = [{'variants': variantUpdates}];
                            config[slotName].ID[1] = itemToSlot;
                            config[slotName].Variants[1] = [{'variants': variantUpdates}];
                            config[slotName].ID[2] = itemToSlot;
                            config[slotName].Variants[2] = [{'variants': variantUpdates}];
                            config[slotName].ID[3] = itemToSlot;
                            config[slotName].Variants[3] = [{'variants': variantUpdates}];
                            config[slotName].ID[4] = itemToSlot;
                            config[slotName].Variants[4] = [{'variants': variantUpdates}];
                            config[slotName].ID[5] = itemToSlot;
                            config[slotName].Variants[5] = [{'variants': variantUpdates}];
                            config[slotName].ID[6] = itemToSlot;
                            config[slotName].Variants[6] = [{'variants': variantUpdates}];
                        }
                    
                    saveConfig(backendConfig.directory, accountId, config);
                    break;
                }
                var newAthena = createAthena(config, accountId, profile);
                res.json(createResponse(newAthena, profileId, rvn));
                break;

            default:
                res.json(createError(
                    'errors.com.epicgames.modules.profiles.operation_forbidden',
                    `Unable to find template configuration for profile ${req.query.profileId}`,
                    12813,
                    'fortnite',
                    'prod-live',
                    [req.query.profileId]
                )
            );
            break;
        };
    }
)

module.exports = app;
