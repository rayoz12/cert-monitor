<script>
  import "carbon-components-svelte/css/all.css";
  import CertTable from './certManager/CertTable.svelte';
  import { getCerts } from "./api";


  const certs = getCerts();

</script>

<main>
  <CertTable certificates={certs}/>
</main>

<style>

</style>
