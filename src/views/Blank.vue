<!--<template>-->
<!--  <h3 class="text-gray-700 text-3xl font-medium">-->
<!--    Blank Page-->
<!--  </h3>-->
<!--</template>-->


<template>
  <div class="p-8">
    <h3 class="text-3xl font-semibold mb-6">Lexicon Management</h3>

    <!-- Toolbar -->
    <Toolbar class="mb-6">
      <template #start>
        <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          outlined
          @click="confirmDeleteSelected"
          :disabled="!selectedLexicons || !selectedLexicons.length"
        />
      </template>
      <template #end>
        <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
      </template>
    </Toolbar>

    <!-- DataTable -->
    <DataTable
      ref="dt"
      v-model:selection="selectedLexicons"
      :value="lexicons"
      dataKey="guid"
      :paginator="true"
      :rows="10"
      :filters="filters"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
    >
      <!-- Table Header with Search -->
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <h4 class="m-0">Manage Lexicon Entries</h4>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Search..." />
          </span>
        </div>
      </template>

      <!-- Table Columns -->
      <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
      <Column field="french" header="French" sortable style="min-width: 12rem"></Column>
      <Column field="english" header="English" sortable style="min-width: 12rem"></Column>
      <Column field="reference" header="Reference" sortable style="min-width: 12rem"></Column>
      <Column field="portable" header="Mobile Export" sortable style="min-width: 8rem">
        <template #body="slotProps">
          <Tag :value="slotProps.data.portable ? 'Yes' : 'No'" :severity="slotProps.data.portable ? 'success' : 'info'" />
        </template>
      </Column>
      <Column :exportable="false" style="min-width: 8rem">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editLexicon(slotProps.data)" />
          <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDelete(slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <!-- Dialog for Add/Edit -->
    <Dialog
      v-model:visible="lexiconDialog"
      :style="{ width: '450px' }"
      header="Lexicon Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <label for="english">English</label>
        <Textarea
          id="english"
          v-model="english"
          required="true"
          rows="3"
          :class="{ 'p-invalid': submitted && !english }"
        />
        <small class="p-error" v-if="submitted && !english">English is required.</small>
      </div>

      <div class="field">
        <label for="french">French</label>
        <Textarea
          id="french"
          v-model="french"
          required="true"
          rows="3"
          :class="{ 'p-invalid': submitted && !french }"
        />
        <small class="p-error" v-if="submitted && !french">French is required.</small>
      </div>

      <div class="field">
        <label for="reference">Reference</label>
        <div class="p-inputgroup">
          <InputText id="reference" v-model="reference" disabled />
          <Button icon="pi pi-copy" @click="copyToClipboard(reference)" />
        </div>
      </div>

      <div class="field-checkbox">
        <Checkbox id="portable" v-model="portable" :binary="true" />
        <label for="portable">Export for Mobile</label>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" outlined @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" @click="registerOrUpdateLexicon" />
      </template>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog
      v-model:visible="deleteDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="selectedLexicons">Are you sure you want to delete the selected entries?</span>
        <span v-else>Are you sure you want to delete this entry?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" outlined @click="deleteDialog = false" />
        <Button label="Yes" icon="pi pi-check" severity="danger" @click="deleteLexicon" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';

// PrimeVue components would need to be imported and registered globally

const toast = useToast();
const dt = ref();
const lexicons = ref([]);
const lexiconDialog = ref(false);
const deleteDialog = ref(false);
const submitted = ref(false);
const selectedLexicons = ref();
const filters = ref({
  global: { value: null, matchMode: 'contains' }
});

// Form fields
const guid = ref(null);
const english = ref('');
const french = ref('');
const reference = ref('');
const portable = ref(false);

function openNew() {
  guid.value = null;
  english.value = '';
  french.value = '';
  reference.value = '';
  portable.value = false;
  submitted.value = false;
  lexiconDialog.value = true;
}

function hideDialog() {
  lexiconDialog.value = false;
  submitted.value = false;
}

function toOpenCamelCase(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

async function registerOrUpdateLexicon() {
  submitted.value = true;

  if (!english.value || !french.value) {
    return;
  }

  try {
    const response = await axios.post('http://192.168.100.103:3000/lexicon/add', {
      english: english.value,
      french: french.value,
      portable: portable.value,
      guid: guid.value
    });

    reference.value = response.data.response.reference;
    await fetchLexicons();

    lexiconDialog.value = false;
    toast.add({
      severity: 'success',
      summary: 'Successful',
      detail: guid.value ? 'Lexicon Updated' : 'Lexicon Created',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving',
      life: 3000
    });
  }
}

function editLexicon(lexicon) {
  guid.value = lexicon.guid;
  english.value = lexicon.english;
  french.value = lexicon.french;
  portable.value = lexicon.portable;
  reference.value = lexicon.reference;
  lexiconDialog.value = true;
}

function confirmDelete(lexicon) {
  selectedLexicons.value = [lexicon];
  deleteDialog.value = true;
}

function confirmDeleteSelected() {
  deleteDialog.value = true;
}

async function deleteLexicon() {
  try {
    for (const lexicon of selectedLexicons.value) {
      await axios.put('http://192.168.100.103:3000/lexicon/delete', { guid: lexicon.guid });
    }

    await fetchLexicons();
    deleteDialog.value = false;
    selectedLexicons.value = null;

    toast.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Lexicons Deleted',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while deleting',
      life: 3000
    });
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Reference copied to clipboard',
        life: 3000
      });
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to copy reference',
        life: 3000
      });
    });
}

function exportCSV() {
  dt.value.exportCSV();
}

async function fetchLexicons() {
  try {
    const response = await axios.get('http://192.168.100.103:3000/lexicon/list_all');
    lexicons.value = response.data.response;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error fetching lexicons',
      life: 3000
    });
  }
}

onMounted(fetchLexicons);

// Watch for changes in english field to update reference
watch(english, (newValue) => {
  if (newValue) {
    reference.value = toOpenCamelCase(newValue);
  } else {
    reference.value = '';
  }
});
</script>

<style scoped>
.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.field {
  margin-bottom: 1.5rem;
}

.field-checkbox {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
