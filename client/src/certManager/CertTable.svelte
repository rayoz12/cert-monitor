<script>
    import {
        DataTable,
        DataTableSkeleton,
        Toolbar,
        ToolbarContent,
        ToolbarSearch,
        ToolbarMenu,
        ToolbarMenuItem,
        Button
    } from "carbon-components-svelte";

    import CheckmarkFilled from "carbon-icons-svelte/lib/CheckmarkFilled.svelte";
    import ErrorFilled from "carbon-icons-svelte/lib/ErrorFilled.svelte";
    import WarningFilled from "carbon-icons-svelte/lib/WarningFilled.svelte";

    export let certificates;
</script>

<div>
    {#await certificates}
        <DataTableSkeleton showHeader={false} showToolbar={true} />
    {:then certs}
        <DataTable
            headers={[
                { key: "website", value: "Website" },
                { key: "issuer", value: "Issuer" },
                { key: "expiry", value: "Expiry" },
                { key: "expiresIn", value: "Expires In" },
                { key: "status", value: "Status" },
            ]}
            rows={certs.map((it) => {
                it.id = it.cert.fingerprint256;
                it.expiry = new Date(it.expiry).toLocaleDateString();
                return it;
            })}
        >
            <Toolbar>
                <ToolbarContent>
                    <ToolbarSearch expanded={true} persistent={true} />
                </ToolbarContent>
            </Toolbar>

            <svelte:fragment slot="cell" let:row let:cell>
                {#if cell.key === "status"}
                    {#if cell.value}
                        {#if row.expiresIn > 14}
                            <CheckmarkFilled style="fill: green" /> Active
                        {:else}
                            <WarningFilled style="fill: orange" /> Expires soon
                        {/if}
                    {:else}
                        <ErrorFilled style="fill: red" /> Expired
                    {/if}
                {:else}
                    {cell.value}
                {/if}
            </svelte:fragment>
        </DataTable>
    {/await}
</div>
