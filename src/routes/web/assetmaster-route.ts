import express from 'express'
const routes = express.Router()
import assetMaster from '../../controllers/web/assetmaster-controller'

routes.get("/master-3", assetMaster.RefAssetBaru3byId)
routes.get("/master-4/:kode_asset_3", assetMaster.RefAssetBaru4byId);
routes.get("/master-5/:kode_asset_4", assetMaster.RefAssetBaru5byId);
routes.get("/master-6/:kode_asset_5", assetMaster.RefAssetBaru6byId);
routes.get("/persediaan/:kode_asset_6", assetMaster.RefAssetPersediaan)

routes.post("/master-4/:kode_asset_3", assetMaster.AddAssetBaru4);
routes.post("/master-5/:kode_asset_4", assetMaster.AddAssetBaru5);
routes.post("/master-6/:kode_asset_5", assetMaster.AddAssetBaru6);
routes.post("/persediaan/:kode_asset_6", assetMaster.AddAssetBaruPersediaan);


export default routes