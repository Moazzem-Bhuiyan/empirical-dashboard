"use client";
import { persistor, store } from "../store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import CustomLoader from "@/components/CustomLoader/CustomLoader";

export default function ReduxProviders({ children }) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex min-h-screen items-center justify-center">
            <CustomLoader />
          </div>
        }
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
