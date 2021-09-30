import { Contracts } from '../../data-contracts';
import { IDeliveryClientConfig } from '../../config';
import {
    continuationTokenHeaderName,
    INetworkResponse,
    ILanguagesQueryConfig,
    Parameters,
    Responses
} from '../../models';
import { QueryService } from '../../services';
import { BaseListingQuery } from '../common/base-listing-query.class';

export class LanguagesQuery extends BaseListingQuery<
    Responses.IListLanguagesResponse,
    Responses.IListLanguagesAllResponse,
    ILanguagesQueryConfig,
    Contracts.IListLanguagesContract
> {
    /**
     * Endpoint
     */
    protected readonly endpoint: string = 'languages';

    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService) {
        super(config, queryService);
    }

    /**
     * Limits the number of taxonomies returned by query
     * @param limit Number of taxonomies to load
     */
    limitParameter(limit: number): this {
        this.parameters.push(new Parameters.LimitParameter(limit));
        return this;
    }

    /**
     * Skips the selected number of taxonomies
     * @param skip Number of taxonomies to skip
     */
    skipParameter(skip: number): this {
        this.parameters.push(new Parameters.SkipParameter(skip));
        return this;
    }

    /**
     * Sets continuation token header
     */
    withContinuationToken(token: string): this {
        this.withHeaders([
            {
                header: continuationTokenHeaderName,
                value: token
            }
        ]);

        return this;
    }

    toPromise(): Promise<
        INetworkResponse<Responses.IListLanguagesResponse, Contracts.IListLanguagesContract>
    > {
        return this.queryService.getLanguages(this.getUrl(), this._queryConfig ?? {});
    }

    getUrl(): string {
        const action = '/' + this.endpoint;

        return super.resolveUrlInternal(action);
    }

    /**
     * Used to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig: ILanguagesQueryConfig): this {
        this._queryConfig = queryConfig;
        return this;
    }

    map(json: any): Responses.IListLanguagesResponse {
        return this.queryService.mappingService.listLanguagesResponse(json);
    }

    protected allResponseFactory(
        items: any[],
        responses: INetworkResponse<Responses.IListLanguagesResponse, Contracts.IListLanguagesContract>[]
    ): Responses.IListLanguagesAllResponse {
        return {
            items: items,
            responses: responses
        };
    }
}
