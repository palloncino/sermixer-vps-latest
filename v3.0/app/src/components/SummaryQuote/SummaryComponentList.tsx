import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import EditIcon from "@mui/icons-material/Edit";
import DiscountIcon from "@mui/icons-material/LocalOffer";
import RemoveIcon from "@mui/icons-material/Remove";
import SaveIcon from "@mui/icons-material/Save";
import SortIcon from "@mui/icons-material/Sort";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Checkbox, FormControlLabel, IconButton, Popover, Slider, styled, TextField, Tooltip, Typography } from "@mui/material";
import EditableDescription from "components/EditableDescription";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppState } from "state/stateContext";
import { ComponentType } from "../../types";
import { formatPrice } from "../../utils/format-price";

interface SummaryComponentListProps {
  components: ComponentType[];
  onComponentChange: (updatedComponents: ComponentType[]) => void;
}

const SummaryComponentList: React.FC<SummaryComponentListProps> = React.memo(({
  components,
  onComponentChange
}) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<'original' | 'asc' | 'desc'>('original');
  const [localComponents, setLocalComponents] = useState<ComponentType[]>([]);
  const { user } = useAppState();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<ComponentType | null>(null);
  const [discountAnchorEl, setDiscountAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [discountComponent, setDiscountComponent] = useState<ComponentType | null>(null);

  const [globalDiscount, setGlobalDiscount] = useState<number>(0);
  const [useGlobalDiscount, setUseGlobalDiscount] = useState<boolean>(false);

  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState<number | null>(null);


  useEffect(() => {
    setLocalComponents(components.map((component, index) => ({
      ...component,
      originalIndex: index,
      discount: component.discount || 0,
      quantity: component.quantity || 1 // Ensure quantity is set
    })));
  }, [components]); // Add components as a dependency

  const handleComponentToggle = (id: string, checked: boolean) => {
    const updatedComponents = localComponents.map(component =>
      component.id === id
        ? {
          ...component,
          included: checked,
          discount: checked && useGlobalDiscount ? globalDiscount : component.discount,
          quantity: component.quantity // Ensure quantity is preserved
        }
        : component
    );
    setLocalComponents(updatedComponents);
    onComponentChange(updatedComponents);
  };

  const handleCheckAll = (checked: boolean) => {
    const updatedComponents = localComponents.map(component => ({
      ...component,
      included: checked,
      discount: checked && useGlobalDiscount ? globalDiscount : component.discount,
      quantity: component.quantity // Ensure quantity is preserved
    }));
    setLocalComponents(updatedComponents);
    onComponentChange(updatedComponents);
  };

  const handleMoveComponent = (id: string, direction: 'up' | 'down') => {
    const index = localComponents.findIndex(component => component.id === id);
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= localComponents.length) return;

    const newComponents = [...localComponents];
    const [removed] = newComponents.splice(index, 1);
    newComponents.splice(newIndex, 0, removed);

    const updatedComponents = newComponents.map((component, idx) => ({
      ...component,
      originalIndex: idx
    }));

    setLocalComponents(updatedComponents);
    onComponentChange(updatedComponents);
  };

  const toggleSort = () => {
    setSortOrder(current => {
      if (current === 'original') return 'asc';
      if (current === 'asc') return 'desc';
      return 'original';
    });
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>, component: ComponentType) => {
    setAnchorEl(event.currentTarget);
    setSelectedComponent(component);
    setNewPrice(component.price); // Initialize price editing state
    setIsEditingPrice(false); // Reset edit mode
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedComponent(null);
  };

  const handleDiscountPopoverOpen = (event: React.MouseEvent<HTMLButtonElement>, component: ComponentType) => {
    setDiscountAnchorEl(event.currentTarget);
    setDiscountComponent(component);
  };

  const handleDiscountPopoverClose = () => {
    setDiscountAnchorEl(null);
    setDiscountComponent(null);
  };

  const handleDiscountChange = (event: Event, newValue: number | number[]) => {
    if (discountComponent) {
      const updatedComponents = localComponents.map(component =>
        component.id === discountComponent.id ? { ...component, discount: newValue as number } : component
      );
      setLocalComponents(updatedComponents);
      onComponentChange(updatedComponents);
      setDiscountComponent({ ...discountComponent, discount: newValue as number });
    }
  };

  // Debounce function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleGlobalDiscountChange = debounce((value: number) => {
    setGlobalDiscount(value);
    if (useGlobalDiscount) {
      const updatedComponents = localComponents.map(component => ({
        ...component,
        discount: component.included ? value : component.discount
      }));
      setLocalComponents(updatedComponents);
      onComponentChange(updatedComponents);
    }
  }, 300); // Adjust the delay as needed

  const handleUseGlobalDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const useGlobal = event.target.checked;
    setUseGlobalDiscount(useGlobal);
    if (useGlobal) {
      const updatedComponents = localComponents.map(component => ({
        ...component,
        discount: component.included ? globalDiscount : component.discount
      }));
      setLocalComponents(updatedComponents);
      onComponentChange(updatedComponents);
    }
  };

  const open = Boolean(anchorEl);
  const discountOpen = Boolean(discountAnchorEl);

  const filteredAndSortedComponents = useMemo(() => {
    return [...localComponents]
      .filter(component => component.name.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => {
        if (sortOrder === 'original') {
          return a.originalIndex - b.originalIndex;
        } else if (sortOrder === 'asc') {
          return a.name.localeCompare(b.name);
        } else
          return b.name.localeCompare(a.name);
      });
  }, [localComponents, filter, sortOrder]);

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return formatPrice(price * (1 - discount / 100));
  };

  const handleQuantityChange = (id: string, increment: boolean) => {
    setLocalComponents(prevComponents => {
      const updatedComponents = prevComponents.map(component => {
        if (component.id === id) {
          const newQuantity = increment ? component.quantity + 1 : Math.max(1, component.quantity - 1);
          return { ...component, quantity: newQuantity };
        }
        return component;
      });
      onComponentChange(updatedComponents);
      return updatedComponents;
    });
  };

  const handleSaveDescription = (id: string, newDescription: string) => {
    const updatedComponents = localComponents.map(component =>
      component.id === id ? { ...component, description: newDescription } : component
    );
    setLocalComponents(updatedComponents);
    onComponentChange(updatedComponents);
  };

  const handlePriceEdit = () => {
    setIsEditingPrice(true);
  };

  const handlePriceSave = (id: string) => {
    if (newPrice !== null && selectedComponent) {
      const updatedComponents = localComponents.map(component =>
        component.id === id ? { ...component, price: newPrice } : component
      );
      setLocalComponents(updatedComponents);
      onComponentChange(updatedComponents);
      setIsEditingPrice(false); // Exit edit mode
    }
  };


  return (
    <ComponentListContainer>
      <ControlsBox>
        <Tooltip title={t("SortAlphabetically")}>
          <IconButton onClick={toggleSort}>
            <SortIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t("CheckAll")}>
          <IconButton onClick={() => handleCheckAll(true)}>
            <CheckBoxIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t("UncheckAll")}>
          <IconButton onClick={() => handleCheckAll(false)}>
            <CheckBoxOutlineBlankIcon />
          </IconButton>
        </Tooltip>
        <TextField
          size="small"
          placeholder={t("FilterByName")}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ flexGrow: 1 }}
        />

        {user?.id ? (
          <GlobalDiscountControl>
            <Tooltip title={t("ActivateDiscountForAllComponents")}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useGlobalDiscount}
                    onChange={handleUseGlobalDiscountChange}
                    name="useGlobalDiscount"
                  />
                }
                label=""
                sx={{ marginRight: 0 }}
              />
            </Tooltip>
            <TextField
              type="number"
              value={globalDiscount}
              onChange={(e) => handleGlobalDiscountChange(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
              disabled={!useGlobalDiscount || !user?.id}
              InputProps={{
                inputProps: { min: 0, max: 100 }
              }}
              sx={{ width: '80px' }}
            />
            <Typography variant="body1">%</Typography>
          </GlobalDiscountControl>
        ) : (
          <>
          </>
        )}
      </ControlsBox>
      {filteredAndSortedComponents.map((component) => (
        <ComponentItem key={component.id} selected={component.included === true}>
          <MoveButtonsContainer>
            <IconButton
              size="small"
              onClick={() => handleMoveComponent(component.id, 'up')}
              disabled={component.originalIndex === 0}
            >
              <ArrowUpwardIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleMoveComponent(component.id, 'down')}
              disabled={component.originalIndex === localComponents.length - 1}
            >
              <ArrowDownwardIcon fontSize="small" />
            </IconButton>
          </MoveButtonsContainer>
          <ComponentCheckbox
            control={
              <Checkbox
                checked={component.included === true}
                onChange={(e) => handleComponentToggle(component.id, e.target.checked)}
              />
            }
            label={
              <ComponentNamePriceContainer>
                <Tooltip title={component.name}>
                  <ComponentName variant="body1" selected={component.included === true}>
                    {component.name}
                  </ComponentName>
                </Tooltip>
                <ComponentPrice variant="caption" selected={component.included === true}>
                  {calculateDiscountedPrice(component.price, component.discount)} {t('EUR')}
                  {component.discount > 0 && (
                    <>
                      <DiscountedPrice variant="caption">
                        ({formatPrice(component.price)})
                      </DiscountedPrice>
                      <DiscountPercentage variant="caption">
                        -{component.discount}%
                      </DiscountPercentage>
                    </>
                  )}
                </ComponentPrice>
              </ComponentNamePriceContainer>
            }
          />
          <Box display="flex" alignItems="center">
            <Tooltip title="Decrease quantity" arrow>
              <IconButton onClick={() => handleQuantityChange(component.id, false)}>
                <RemoveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Quantity" arrow>
              <Typography variant="body1">
                {`${component.quantity}`}
              </Typography>
            </Tooltip>
            <Tooltip title="Increase quantity" arrow>
              <IconButton onClick={() => handleQuantityChange(component.id, true)}>
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="View details" arrow>
              <IconButton onClick={(e) => handlePopoverOpen(e, component)}>
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {user?.id ? (
              <Tooltip title="Set discount" arrow>
                <IconButton onClick={(e) => handleDiscountPopoverOpen(e, component)}>
                  <DiscountIcon fontSize="small" color={component.discount > 0 ? "secondary" : "action"} />
                </IconButton>
              </Tooltip>
            ) : (
              <>
              </>
            )}
          </Box>
        </ComponentItem>
      ))}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {selectedComponent && (
          <Box padding={2}>
            <Typography variant="h6">{selectedComponent.name}</Typography>

            {/* Editable Description */}
            <EditableDescription
              initialDescription={selectedComponent.description || t("NoDescriptionAvailable")}
              onSave={(newDescription) => {
                const updatedComponents = localComponents.map(component =>
                  component.id === selectedComponent.id ? { ...component, description: newDescription } : component
                );
                setLocalComponents(updatedComponents);
                onComponentChange(updatedComponents);
              }}
            />

            {/* Editable Price */}
            <Box display="flex" alignItems="center" marginTop={2}>
              {isEditingPrice ? (
                <>
                  <TextField
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    label={t("Price")}
                    fullWidth
                  />
                  <IconButton onClick={() => handlePriceSave(selectedComponent.id)}>
                    <SaveIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <Typography variant="subtitle1">
                    {formatPrice(newPrice !== null ? newPrice : selectedComponent.price)}
                  </Typography>
                  <IconButton onClick={handlePriceEdit}>
                    <EditIcon />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>
        )}
      </Popover>

      <Popover
        open={discountOpen}
        anchorEl={discountAnchorEl}
        onClose={handleDiscountPopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {discountComponent && (
          <DiscountSliderContainer>
            <Typography variant="subtitle1">{t("Discount")}</Typography>
            <Slider
              value={discountComponent.discount || 0}
              onChange={(event, newValue) => {
                handleDiscountChange(event, newValue);
                setDiscountComponent(prev => prev ? { ...prev, discount: newValue as number } : null);
              }}
              aria-labelledby="discount-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={100}
            />
            <Typography variant="body2">
              {t("DiscountedPrice")}: {calculateDiscountedPrice(discountComponent.price, discountComponent.discount || 0)} {t('EUR')}
            </Typography>
          </DiscountSliderContainer>
        )}
      </Popover>
    </ComponentListContainer>
  );
});

export default SummaryComponentList;

const ComponentDetails = styled(Box)({
  padding: '16px',
  maxWidth: '300px',
});

const ComponentListContainer = styled(Box)({
  borderRadius: '4px',
  padding: '16px',
  width: '100%',
});

const ControlsBox = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
  gap: '8px',
  flexWrap: 'wrap',
});

const ComponentItem = styled(Box)<{ selected: boolean }>(({ selected }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
  width: '100%',
  '&:last-child': {
    marginBottom: 0,
  },
  opacity: selected ? 1 : 0.7,
}));

const MoveButtonsContainer = styled(Box)({
  display: 'flex',
  flexShrink: 0,
  marginRight: '8px',
});

const ComponentCheckbox = styled(FormControlLabel)({
  flex: 1,
  marginRight: '8px',
  minWidth: 0,
  overflow: 'hidden',
});

const ComponentNamePriceContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
});

const ComponentName = styled(Typography)<{ selected: boolean }>(({ selected }) => ({
  whiteSpace: 'nowrap',
  fontWeight: selected ? 'bold' : 'normal',
  color: selected ? '#000' : '#666',
}));

const ComponentPrice = styled(Typography)<{ selected: boolean }>(({ selected }) => ({
  color: selected ? '#000' : '#666',
  fontWeight: selected ? 'bold' : 'normal',
}));

const DiscountedPrice = styled(Typography)({
  textDecoration: 'line-through',
  marginLeft: '4px',
  color: '#999',
});

const DiscountPercentage = styled(Typography)({
  marginLeft: '4px',
  color: '#4caf50',
});

const DiscountSliderContainer = styled(Box)({
  padding: '16px',
  width: '250px',
});

const GlobalDiscountControl = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
});