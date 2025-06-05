import { useDispatch, type TypedUseSelectorHook, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelectore: TypedUseSelectorHook<RootState> = useSelector;