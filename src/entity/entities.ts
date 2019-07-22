import { ActivityType } from './activity_type';
import { Category } from './category';
import { CategoryMappings } from './category_mappings';
import { User } from './user';
import { Condition } from './condition';
import { ConditionMappings } from './condition_mappings';
import { Currency } from './currency';
import { CurrencyMappings } from './currency_mappings';
import { ItemDetails } from './item_details';
import { ItemGallery } from './item_gallery';
import { Items } from './items';
import { ListingOrder } from './listing_order';
import { ListingOrderItems } from './listing_order_items';
import { ListingType } from './listing_type';
import { ListingTypeMappings } from './listing_type_mappings';
import { LoginHistory } from './login_history';
import { RefreshToken } from './refresh_token';
import { SiteSpecificListingInfo } from './site_specific_listing_info';
import { UpdateItemQuantity } from './update_item_quantity';
import { UserActivity } from './user_activity';
import { TradingSite } from './trading_site';

export const ENTITIES = [User, ActivityType, Category, CategoryMappings, Condition, ConditionMappings, Currency, CurrencyMappings,
  ItemDetails, ItemGallery, Items, ListingType, LoginHistory, RefreshToken, UpdateItemQuantity, UserActivity, UserActivity, ListingTypeMappings,
  SiteSpecificListingInfo, ListingOrder, ListingOrderItems, TradingSite];
