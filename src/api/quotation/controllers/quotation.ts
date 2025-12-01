/**
 * quotation controller
 */
import { factories } from "@strapi/strapi";
import type { Context } from "koa";

export default factories.createCoreController("api::quotation.quotation", ({ strapi }) => ({

  //--------------------------------------------------------
  // CREATE: Auto-generate document number (financial year-wise)
  //--------------------------------------------------------
  async create(ctx: Context) {
    try {
      const fy = getFinancialYear();

      const latestRecords = await strapi.db.query("api::quotation.quotation").findMany({
        where: { financialYear: fy },
        orderBy: { documentNo: "desc" },
        limit: 1,
      });

      let nextDocNo = 1;
      if (latestRecords.length > 0 && latestRecords[0].documentNo) {
        nextDocNo = Number(latestRecords[0].documentNo) + 1;
      }

      const body = ctx.request.body || {};
      const data = body.data || body;

      if (!data || typeof data !== "object") {
        return ctx.badRequest("Invalid request body format — expected { data: {...} }");
      }

      data.documentNo = nextDocNo;
      data.financialYear = fy;

      const quotation = await strapi.entityService.create("api::quotation.quotation", { data });

      strapi.log.info(`✅ Created Quotation FY ${fy} - DocNo: ${nextDocNo}`);
      return { data: quotation };

    } catch (error: any) {
      strapi.log.error("❌ Error creating quotation:", error);
      ctx.response.status = 500;
      return { error: "Failed to create quotation", details: error.message };
    }
  },

  //--------------------------------------------------------
  // FIND ONE
  //--------------------------------------------------------
  async findOne(ctx: Context) {
    const { id } = ctx.params;

    try {
      const quotation = await strapi.db.query("api::quotation.quotation").findOne({
        where: { id: Number(id) },
        populate: { items: true, materials: true },
      });

      if (!quotation) return ctx.notFound("Quotation not found");
      return { data: quotation };

    } catch (error: any) {
      strapi.log.error("❌ Error fetching quotation:", error);
      ctx.response.status = 500;
      return { error: "Failed to fetch quotation", details: error.message };
    }
  },

  //--------------------------------------------------------
  // UPDATE
  //--------------------------------------------------------
  async update(ctx: Context) {
    const { id } = ctx.params;

    try {
      if (!id) return ctx.badRequest("Missing quotation ID");

      const body = ctx.request.body || {};
      const data = body.data || body;

      if (!data || typeof data !== "object") {
        return ctx.badRequest("Invalid request body format");
      }

      const existing = await strapi.db.query("api::quotation.quotation").findOne({
        where: { id: Number(id) },
      });

      if (!existing) return ctx.notFound("Quotation not found");

      delete data.id;
      delete data.createdAt;
      delete data.updatedAt;

      const updatedQuotation = await strapi.entityService.update(
        "api::quotation.quotation",
        Number(id),
        { data, populate: ["items", "materials"] }
      );

      strapi.log.info(`✅ Quotation ${id} updated successfully`);
      return { data: updatedQuotation };

    } catch (error: any) {
      strapi.log.error("❌ Error updating quotation:", error);
      ctx.response.status = 500;
      return { error: "Failed to update quotation", details: error.message };
    }
  },

  //--------------------------------------------------------
  // DELETE
  //--------------------------------------------------------
  async delete(ctx: Context) {
    const { id } = ctx.params;

    try {
      const deletedQuotation = await strapi.db.query("api::quotation.quotation").delete({
        where: { id: Number(id) },
      });

      if (!deletedQuotation) return ctx.notFound("Quotation not found");

      strapi.log.info(`🗑️ Quotation ${id} permanently deleted`);
      return { message: "Quotation permanently deleted", data: deletedQuotation };

    } catch (error: any) {
      strapi.log.error("❌ Error deleting quotation:", error);
      ctx.response.status = 500;
      return { error: "Failed to delete quotation", details: error.message };
    }
  },

  //--------------------------------------------------------
  // UPLOAD PDF  (MERGED FUNCTION)
  //--------------------------------------------------------
  async uploadPdf(ctx: Context) {
    try {
      const { files } = ctx.request;

      if (!files || !files.file) {
        return ctx.badRequest("No file found");
      }

      const uploaded = await strapi.plugins.upload.services.upload.upload({
        data: {},
        files: files.file,
      });

      return uploaded[0]; // return uploaded file object
    } catch (error: any) {
      strapi.log.error("❌ PDF upload error:", error);
      return ctx.badRequest("Failed to upload file");
    }
  },

}));

//---------------------------------------------------------
// Helper: Determine Financial Year (April → March)
//---------------------------------------------------------
function getFinancialYear(date: Date = new Date()): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return month >= 4 ? year + 1 : year;
}
