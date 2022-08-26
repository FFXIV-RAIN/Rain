declare module '@xivapi/js' {
    class ResourceAPI<T> {
        req(path: string, params: { [key: string]: any; }): T;
        reqJSON(path: string, body: any): T;
    }

    class DataAPI extends ResourceAPI<XIVAPI.Data> {
    }

    class CharacterAPI extends ResourceAPI<XIVAPI.Character> {
        search(name: string, params: CharacterAPI.SearchParams): Promise<XIVAPI.Character>;
        get(id: string, params: CharacterAPI.GetParams)
    }

    namespace CharacterAPI {
        export interface SearchParams {
            server?: XIVAPI.DataCentersAndServers;
            page?: number;
        }

        export interface GetParams {
            extended?: 1;
            data?: string;
        }
    }
    
    class FreeCompanyAPI extends ResourceAPI<FreeCompanyAPI.FreeCompany> {
        search(name: string, params: FreeCompanyAPI.SearchParams): Promise<FreeCompanyAPI.FreeCompany>;
        get(name: string, params: FreeCompanyAPI.SearchParams);
    }

    namespace FreeCompanyAPI {
        export interface SearchParams {
            server?: XIVAPI.Servers;
            page?: number;
        }

        export interface GetParams {
            extended?: 1;
            data?: string;
        }

        export interface FreeCompanySearchResult {
            ID: string;
            Crest: string[];
            Name: string;
            Server: string;
        }

        export interface FreeCompany {
        }
    }
    
    class LinkshellAPI extends ResourceAPI<XIVAPI.Linkshell> {
    }
    
    class PvPTeamAPI extends ResourceAPI<XIVAPI.PvPTeam> {
    }

    class XIVAPI {
        constructor(options?: XIVAPI.Options);
        endpoint: string;

        search(input: string, params: XIVAPI.NoStringSearchParams): Promise<any>;
        search(input: object, params: XIVAPI.FullSearchParams): Promise<any>;
        search(input: string|object, params: XIVAPI.FullSearchParams): Promise<any>;

        data: DataAPI;
        character: CharacterAPI;
        freecompany: FreeCompanyAPI;
        linkshell: LinkshellAPI;
        pvpteam: PvPTeamAPI;
    }

    namespace XIVAPI {
        export type DataCenters = (
            '_dc_Aether'|
            '_dc_Crystal'|
            '_dc_Primal'|
            '_dc_Chaos'|
            '_dc_Light'|
            '_dc_Elemental'|
            '_dc_Gaia'|
            '_dc_Mana'|
            '_dc_Materia'
        )
        
        export type Servers = (
            'Adamantoise'|'Aegis'|'Alexander'|'Anima'|'Asura'|'Atomos'|
            'Bahamut'|'Balmung'|'Behemoth'|'Belias'|'Brynhildr'|'Bismarck'|
            'Cactuar'|'Carbuncle'|'Cerberus'|'Chocobo'|'Coeurl'|
            'Diabolos'|'Durandal'|
            'Excalibur'|'Exodus'|
            'Faerie'|'Famfrit'|'Fenrir'|
            'Garuda'|'Gilgamesh'|'Goblin'|'Gungnir'|
            'Hades'|'Hyperion'|
            'Ifrit'|'Ixion'|
            'Jenova'|
            'Kujata'|
            'Lamia'|'Leviathan'|'Lich'|'Louisoix'|
            'Malboro'|'Mandragora'|'Masamune'|'Mateus'|'Midgardsormr'|'Moogle'|
            'Odin'|'Omega'|
            'Pandaemonium'|'Phoenix'|
            'Ragnarok'|'Ramuh'|'Ridill'|'Ravana'|
            'Sargatanas'|'Shinryu'|'Shiva'|'Siren'|'Spriggan'|'Sephirot'|'Sophia'|
            'Tiamat'|'Titan'|'Tonberry'|'Typhon'|'Twintania'|
            'Ultima'|'Ultros'|'Unicorn'|
            'Valefor'|
            'Yojimbo'|
            'Zalera'|'Zeromus'|'Zodiark'|'Zurvan'|

            'HongYuHai'|'ShenYiZhiDi'|'LaNuoXiYa'|'HuanYingQunDao'|'MengYaChi'|'YuZhouHeYin'|
            'WoXianXiRan'|'ChenXiWangZuo'|'BaiYinXiang'|'BaiJinHuanXiang'|'ShenQuanHen'|'ChaoFengTing'|
            'LvRenZhanQiao'|'FuXiaoZhiJian'|'Longchaoshendian'|'MengYuBaoJing'|'ZiShuiZhanQiao'|
            'YanXia'|'JingYuZhuangYuan'|'MoDuNa'|'HaiMaoChaWu'|'RouFengHaiWan'|'HuPoYuan'|'ShuiJingTa2'|
            'YinLeiHu2'|'TaiYangHaiAn2'|'YiXiuJiaDe2'|'HongChaChuan2'
        )

        export type DataCentersAndServers = DataCenters & Servers;
        
        export interface Options {
            staging?: boolean;
            language?: ('en'|'ja'|'de'|'fr'|'cn'|'kr');
            private_key?: string;
            verbose?: boolean;
        }

        export interface NoStringSearchParams {
            lore?: boolean;
            string_algo?: ('custom'|'wildcard'|'wildcard_plus'|'fuzzy'|'term'|'prefix'|'match'|'match_phrase'|'match_phrase_prefix'|'multi_match'|'query_string');
            string_column?: string;
            page?: number;
            sort_field?: string;
            sort_order?: ('asc'|'desc');
            limit?: number;
        }

        export interface FullSearchParams extends NoStringSearchParams {
            string: string;
        }

        export interface Data {
        }

        export interface Character {
        }

        export interface Linkshell {
        }

        export interface PvPTeam {
        }
    }

    export = XIVAPI;
}