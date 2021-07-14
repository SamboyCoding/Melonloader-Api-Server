import CloudflareZoneMeta from "./CloudflareZoneMeta";

interface Owner {
    id: string;
    type: string;
    email: string;
}
interface Account {
    id: string;
    name: string;
}
interface Plan {
    id: string;
    name: string;
    price: number;
    currency: string;
    frequency: string;
    is_subscribed: boolean;
    can_subscribe: boolean;
    legacy_id: string;
    legacy_discount: boolean;
    externally_managed: boolean;
}

export default interface CloudflareZone {
    id: string;
    name: string;
    status: string;
    paused: boolean;
    type: string;
    development_mode: number;
    name_servers: string[];
    original_name_servers: string[];
    original_registrar: string;
    original_dnshost?: string | null;
    modified_on: string;
    created_on: string;
    activated_on: string;
    meta: CloudflareZoneMeta;
    owner: Owner;
    account: Account;
    permissions: string[];
    plan: Plan;
}
