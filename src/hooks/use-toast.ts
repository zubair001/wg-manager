import { Action, ActionType, State, ToasterToast } from "@/interfaces/types";
import * as React from "react";
import { TOASTER_CONFIG } from "@/lib/constants";

// Utils
let toastCounter = 0;
const genId = () => `${++toastCounter % Number.MAX_SAFE_INTEGER}`;
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

// Reducer
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(
          0,
          TOASTER_CONFIG.TOAST_LIMIT
        ),
      };

    case ActionType.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case ActionType.DISMISS_TOAST: {
      const toastIds = action.toastId
        ? [action.toastId]
        : state.toasts.map((t) => t.id);
      toastIds.forEach(scheduleToastRemoval);

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          toastIds.includes(t.id) ? { ...t, open: false } : t
        ),
      };
    }

    case ActionType.REMOVE_TOAST:
      return {
        ...state,
        toasts: action.toastId
          ? state.toasts.filter((t) => t.id !== action.toastId)
          : [],
      };

    default:
      return state;
  }
};

// Dispatch and listener system
let memoryState: State = { toasts: [] };
const listeners: Array<(state: State) => void> = [];

const dispatch = (action: Action) => {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
};

// Remove toast with delay
const scheduleToastRemoval = (id: string) => {
  if (toastTimeouts.has(id)) return;
  const timeout = setTimeout(() => {
    toastTimeouts.delete(id);
    dispatch({ type: ActionType.REMOVE_TOAST, toastId: id });
  }, TOASTER_CONFIG.TOAST_REMOVE_DELAY);
  toastTimeouts.set(id, timeout);
};

// Main toast functions
type Toast = Omit<ToasterToast, "id">;

function toast(props: Toast) {
  const id = genId();

  const dismiss = () =>
    dispatch({ type: ActionType.DISMISS_TOAST, toastId: id });
  const update = (updatedProps: Toast) =>
    dispatch({ type: ActionType.UPDATE_TOAST, toast: { ...updatedProps, id } });

  dispatch({
    type: ActionType.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => !open && dismiss(),
    },
  });

  return { id, dismiss, update };
}

// React custom hook
function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index !== -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: ActionType.DISMISS_TOAST, toastId }),
  };
}

export { useToast, toast };
