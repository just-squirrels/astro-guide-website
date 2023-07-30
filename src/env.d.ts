/// <reference types="astro/client" />
declare namespace App {
    interface Locals {
        sid: string;
        secret: string;
        alias?: string;
        admin?: boolean;
        mod?: boolean;
    }
}