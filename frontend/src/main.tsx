import { DehydrateOptions, MutationCache, QueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const queryClient = new QueryClient({
    mutationCache: new MutationCache({
        onSuccess: () => {
            queryClient.invalidateQueries();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    }),
});

const persister = createSyncStoragePersister({
    storage: window.localStorage,
});

const dehydrateOptions: DehydrateOptions = {
    shouldDehydrateQuery: ({ meta }) => {
        return meta ? meta.cache !== false : true;
    },
};


const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister, dehydrateOptions }}>
        <ToastContainer />
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </PersistQueryClientProvider>,
);