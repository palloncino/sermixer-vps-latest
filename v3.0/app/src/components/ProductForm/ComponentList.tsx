import React, { useState } from "react";
import { Box, Button, Pagination, Accordion, AccordionSummary, AccordionDetails, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useTranslation } from "react-i18next";
import { ComponentType } from "../../types";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ComponentItem from "./ComponentItem";

interface ComponentListProps {
  components: ComponentType[];
  onComponentChange: (index: number, updatedComponent: Partial<ComponentType>) => void;
  onComponentImageChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddComponent: () => void;
  onRemoveComponent: (index: number) => void;
  onReorderComponents: (newComponents: ComponentType[]) => void;
  getPreviewUrl: (image: File | undefined, imgUrl: string | undefined, key: string) => string; // Add this line
}

const ITEMS_PER_PAGE = 20;

const ComponentList: React.FC<ComponentListProps> = ({
  components,
  onComponentChange,
  onComponentImageChange,
  onAddComponent,
  onRemoveComponent,
  onReorderComponents,
  getPreviewUrl, // Add this line
}) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [expandedIndex, setExpandedIndex] = useState<number | false>(false);

  const isLastComponentEmpty = () => {
    if (components.length === 0) return false;
    const lastComponent = components[components.length - 1];
    return !lastComponent.name && !lastComponent.description && !lastComponent.price;
  };

  const handleMoveComponent = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= components.length) return;

    const newComponents = [...components];
    const [removed] = newComponents.splice(index, 1);
    newComponents.splice(newIndex, 0, removed);
    onReorderComponents(newComponents);
  };

  const paginatedComponents = components.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>{t("Components")}</Typography>
      {paginatedComponents.map((component, index) => {
        const actualIndex = (page - 1) * ITEMS_PER_PAGE + index;
        return (
          <Accordion
            key={component.id || `component-${actualIndex}`}
            expanded={expandedIndex === actualIndex}
            onChange={() => setExpandedIndex(expandedIndex === actualIndex ? false : actualIndex)}
            sx={{ mb: 2, boxShadow: 'none', border: '1px solid #e0e0e0', borderRadius: '8px' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center" width="100%">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveComponent(actualIndex, 'up');
                  }}
                  disabled={actualIndex === 0}
                >
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveComponent(actualIndex, 'down');
                  }}
                  disabled={actualIndex === components.length - 1}
                >
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ ml: 1 }}>{component.name || t("Unnamed Component")}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <ComponentItem
                component={component}
                index={actualIndex}
                onChange={(updatedComponent) => onComponentChange(actualIndex, updatedComponent)}
                onImageChange={(e) => onComponentImageChange(actualIndex, e)}
                onRemove={() => onRemoveComponent(actualIndex)}
                getPreviewUrl={getPreviewUrl}
              />
            </AccordionDetails>
          </Accordion>
        );
      })}
      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
        <Pagination
          count={Math.ceil(components.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={onAddComponent}
          startIcon={<AddIcon />}
          disabled={isLastComponentEmpty()}
        >
          {t("AddComponent")}
        </Button>
      </Box>
    </Box>
  );
};

export default ComponentList;
