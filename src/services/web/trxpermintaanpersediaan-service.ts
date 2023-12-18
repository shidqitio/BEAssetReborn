import { TrxPermintaanHeaderRequest, TrxPermintaanDetailRequest } from "../../controllers/web/trxpermintaanpersediaan-controller";
import db from "../../config/database";
import { Op } from "sequelize";
import TrxBastPersediaan from "../../models/trxbast-model";
import TrxPermintaanPersediaanHeader from "../../models/trxpermintaanpersediaanheader-model";
import TrxBarangPersediaanDetail from "../../models/trxpersediaandetail-model";