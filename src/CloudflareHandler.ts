import Cloudflare from "cloudflare";
import CloudflareApiListingResponse from "./nonDbModels/cloudflare/CloudflareApiListingResponse";
import CloudflareZone from "./nonDbModels/cloudflare/CloudflareZone";
import CloudflareApiResponse from "./nonDbModels/cloudflare/CloudflareApiResponse";

const DOMAIN_NAME = "melonloader.com";

export default class CloudflareHandler {
    private api: Cloudflare;
    private targetZoneId: string;

    public async Init(): Promise<boolean> {
        console.log("[Cloudflare] Verifying API Token...");

        if(!process.env.CLOUDFLARE_TOKEN) {
            console.error("[Cloudflare] API Token not set. Set CLOUDFLARE_TOKEN in environment variables");
            return false;
        }

        this.api = new Cloudflare({
            token: process.env.CLOUDFLARE_TOKEN,
        });

        const zones = await this.api.zones.browse() as CloudflareApiListingResponse<CloudflareZone>;

        console.log(`[Cloudflare] Token is valid. It provides access to ${zones.result_info.count} zone(s):\n- ${zones.result.map(z => z.name).join("\n- ")}`);

        const mlZone = zones.result.find(z => z.name == DOMAIN_NAME);

        if(!mlZone) {
            console.error(`[Cloudflare] Could not find a zone with name ${DOMAIN_NAME}. Please ensure the token has zone:read or zone:edit permission on that domain.`);
            return false;
        }

        this.targetZoneId = mlZone.id;

        console.log(`[Cloudflare] Located target domain (${DOMAIN_NAME}) with zone ID ${this.targetZoneId}`);

        return true;
    }

    public async purgeCache(): Promise<boolean> {
        //Purge everything from target zone
        console.log("[Cloudflare] Purging cache!");

        const result = await this.api.zones.purgeCache(this.targetZoneId, {
            // This is not in the library, annoyingly, but should work
            // @ts-ignore
            purge_everything: true
        }) as CloudflareApiResponse<any>;

        return result.success;
    }
}