import type { SearchResultItem } from "@common/Core";
import { Text } from "@fluentui/react-components";
import type { RefObject } from "react";
import { useTranslation } from "react-i18next";
import { SearchResultListItem } from "./SearchResultListItem";

type SearchResultListProps = {
    containerRef: RefObject<HTMLDivElement>;
    selectedItemIndex: number;
    searchResultItems: SearchResultItem[];
    searchTerm?: string;
    onSearchResultItemClick: (index: number) => void;
    onSearchResultItemDoubleClick: (searchResultItem: SearchResultItem) => void;
};

export const SearchResultList = ({
    containerRef,
    selectedItemIndex,
    searchResultItems,
    searchTerm,
    onSearchResultItemClick,
    onSearchResultItemDoubleClick,
}: SearchResultListProps) => {
    const { t } = useTranslation();
    const noResultsFoundMessage = searchTerm
        ? `${t("search.noResultsFoundFor")} "${searchTerm}"`
        : t("search.noResultsFound");

    return (
        <div
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                padding: 10,
                boxSizing: "border-box",
            }}
        >
            {searchResultItems.length ? (
                searchResultItems.map((searchResultItem, index) => (
                    <SearchResultListItem
                        containerRef={containerRef}
                        key={searchResultItem.id}
                        isSelected={selectedItemIndex === index}
                        searchResultItem={searchResultItem}
                        onClick={() => onSearchResultItemClick(index)}
                        onDoubleClick={() => onSearchResultItemDoubleClick(searchResultItem)}
                    />
                ))
            ) : (
                <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Text>{noResultsFoundMessage}</Text>
                </div>
            )}
        </div>
    );
};
