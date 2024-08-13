import type { SearchResultItem } from "@common/Core";
import { searchFilter, SearchResultItemFilter, type SearchEngineId } from "@common/Core/Search";

export const getSearchResult = ({
    searchEngineId,
    favoriteSearchResultItemIds,
    excludedSearchResultItemIds,
    instantSearchResultItems,
    searchResultItems,
    searchTerm,
    fuzziness,
    maxSearchResultItems,
    maxSearchResultItemsEmptySearchTerm,
}: {
    searchEngineId: SearchEngineId;
    favoriteSearchResultItemIds: string[];
    excludedSearchResultItemIds: string[];
    instantSearchResultItems: SearchResultItem[];
    searchResultItems: SearchResultItem[];
    searchTerm: string;
    fuzziness: number;
    maxSearchResultItems: number;
    maxSearchResultItemsEmptySearchTerm: number;
}): Record<string, SearchResultItem[]> => {
    searchResultItems = SearchResultItemFilter.createFrom(searchResultItems).exclude(excludedSearchResultItemIds).get();

    if (searchTerm.length > 0) {
        const searchFilterItems = searchFilter(
            {
                searchResultItems,
                searchTerm: searchTerm.trim(),
                fuzziness,
                maxSearchResultItems,
            },
            searchEngineId,
        );

        return {
            favorites: SearchResultItemFilter.createFrom(searchFilterItems).pick(favoriteSearchResultItemIds).get(),
            searchResults: [
                ...SearchResultItemFilter.createFrom(searchFilterItems).exclude(favoriteSearchResultItemIds).get(),
                ...instantSearchResultItems,
            ],
        };
    } else {
        return {
            favorites: SearchResultItemFilter.createFrom(searchResultItems)
                .pick(favoriteSearchResultItemIds)
                .sortAlphabetically()
                .get(),
            searchResults: SearchResultItemFilter.createFrom(searchResultItems)
                .exclude(favoriteSearchResultItemIds)
                .sortAlphabetically()
                .limit(maxSearchResultItemsEmptySearchTerm)
                .get(),
        };
    }
};
