import { ElementModels, LanguageVariantResponses, SharedModels } from '../../lib';
import * as jsonResponse from '../fake-responses/language-variants/fake-upsert-language-variant.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';


describe('Upsert language variant', () => {
    let response: LanguageVariantResponses.UpsertLanguageVariantResponse;

    beforeAll((done) => {
        getTestClientWithJson(jsonResponse).upsertLanguageVariant()
            .byItemCodename('x')
            .byLanguageCodename('x')
            .withElements([])
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const codenameUrlWithCodenameLanguage = cmTestClient.upsertLanguageVariant().byItemCodename('xCodename').byLanguageCodename('xLanguageCodename').withElements([]).getUrl();
        const internalIdUrlWithCodenameLanguage = cmTestClient.upsertLanguageVariant().byItemId('xItemId').byLanguageCodename('xLanguageCodename').withElements([]).getUrl();
        const externalIdUrlWithCodenameLanguage = cmTestClient.upsertLanguageVariant().byItemExternalId('XItemExternal').byLanguageCodename('xLanguageCodename').withElements([]).getUrl();

        const codenameUrlWithIdLanguage = cmTestClient.upsertLanguageVariant().byItemCodename('xCodename').byLanguageId('xLanguageId').withElements([]).getUrl();
        const internalIdUrlWithIdLanguage = cmTestClient.upsertLanguageVariant().byItemId('xItemId').byLanguageId('xLanguageId').withElements([]).getUrl();
        const externalIdUrlWithIdLanguage = cmTestClient.upsertLanguageVariant().byItemExternalId('XItemExternal').byLanguageId('xLanguageId').withElements([]).getUrl();

        expect(codenameUrlWithCodenameLanguage).toEqual(`https://manage.kenticocloud.com/v2/projects/${testProjectId}/items/codename/xCodename/variants/codename/xLanguageCodename`);
        expect(internalIdUrlWithCodenameLanguage).toEqual(`https://manage.kenticocloud.com/v2/projects/${testProjectId}/items/xItemId/variants/codename/xLanguageCodename`);
        expect(externalIdUrlWithCodenameLanguage).toEqual(`https://manage.kenticocloud.com/v2/projects/${testProjectId}/items/external-id/XItemExternal/variants/codename/xLanguageCodename`);

        expect(codenameUrlWithIdLanguage).toEqual(`https://manage.kenticocloud.com/v2/projects/${testProjectId}/items/codename/xCodename/variants/xLanguageId`);
        expect(internalIdUrlWithIdLanguage).toEqual(`https://manage.kenticocloud.com/v2/projects/${testProjectId}/items/xItemId/variants/xLanguageId`);
        expect(externalIdUrlWithIdLanguage).toEqual(`https://manage.kenticocloud.com/v2/projects/${testProjectId}/items/external-id/XItemExternal/variants/xLanguageId`);
    });

    it(`response should be instance of UpsertLanguageVariantResponse class`, () => {
        expect(response).toEqual(jasmine.any(LanguageVariantResponses.UpsertLanguageVariantResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
        expect(response.data.elements).toBeDefined();
        expect(response.data.item).toBeDefined();
        expect(response.data.language).toBeDefined();
        expect(response.data.lastModified).toBeDefined();
    });

    it(`item properties should be mapped`, () => {
        const variant = response.data;
        const originalItem = jsonResponse;

        if (!originalItem) {
            throw Error(`Could not find original item with id '${variant.item.id}'`);
        }

        expect(variant.item).toBeDefined();
        expect(variant.language).toBeDefined();
        expect(variant.elements).toBeDefined();
        expect(variant.lastModified).toEqual(jasmine.any(Date));
        expect(variant.workflowStep.id).toEqual(originalItem.workflow_step.id);

        expect(variant.item).toEqual(jasmine.any(SharedModels.ReferenceObject));
        expect(variant.language).toEqual(jasmine.any(SharedModels.ReferenceObject));

        variant.elements.forEach(element => {
            const originalElement = originalItem.elements.find(m => m.element.id === element.element.id);

            expect(element).toEqual(jasmine.any(ElementModels.ContentItemElement));

            if (!originalElement) {
                throw Error(`Original element with id '${element.element.id}' was not found`);
            }

            if (Array.isArray(element.value)) {
                element.value.forEach(elementReference => {
                    expect(elementReference).toEqual(jasmine.any(SharedModels.ReferenceObject));
                });
            } else {
                expect(element.value).toEqual(originalElement.value as string | number);
            }
        });
    });

});
