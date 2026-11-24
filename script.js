const notesGrid = document.getElementById("notesGrid");
const emptyState = document.getElementById("emptyState");
const noteModal = document.getElementById("noteModal");
const noteForm = document.getElementById("noteForm");
const titleInput = document.getElementById("noteTitle");
const contentInput = document.getElementById("noteContent");
const searchInput = document.getElementById("searchInput");
const noteCount = document.getElementById("noteCount");
const visibleCount = document.getElementById("visibleCount");
const modalHeading = document.getElementById("modalHeading");
const toast = document.getElementById("toast");
let notes = [];
let editingId = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[char]));
}
function formatDate(value) {
  const date = new Date(value.replace(" ", "T") + "Z");
  return Number.isNaN(date.getTime()) ? "Recently updated" :
    date.toLocaleString([], {month:"short", day:"numeric", hour:"numeric", minute:"2-digit"});
}
async function loadNotes() {
  try {
    const response = await fetch("/api/notes");
    if (!response.ok) throw new Error("Could not load notes");
    notes = await response.json();
    renderNotes();
  } catch (error) {
    showToast("Unable to connect to the server. Please refresh.");
  }
}
function renderNotes() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = notes.filter(note =>
    note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query)
  );
  noteCount.textContent = notes.length;
  visibleCount.textContent = filtered.length;
  notesGrid.innerHTML = filtered.map(note => `
    <article class="note-card">
      <h3>${escapeHTML(note.title)}</h3>
      <p>${escapeHTML(note.content)}</p>
      <div class="note-meta"><span>${formatDate(note.updated_at)}</span>
        <div class="note-actions">
          <button onclick="editNote(${note.id})" aria-label="Edit note">Edit</button>
          <button onclick="deleteNote(${note.id})" aria-label="Delete note">Delete</button>
        </div>
      </div>
    </article>`).join("");
  emptyState.classList.toggle("visible", filtered.length === 0);
  if (filtered.length === 0 && query) {
    emptyState.querySelector("h3").textContent = "No matching notes";
    emptyState.querySelector("p").textContent = "Try another search term.";
    document.getElementById("emptyNewButton").style.display = "none";
  } else {
    emptyState.querySelector("h3").textContent = "No notes yet";
    emptyState.querySelector("p").textContent = "Start with a thought, a reminder, or an idea you don't want to forget.";
    document.getElementById("emptyNewButton").style.display = "inline-block";
  }
}
function openModal(note = null) {
  editingId = note ? note.id : null;
  modalHeading.textContent = note ? "Edit your note" : "Create a note";
  titleInput.value = note ? note.title : "";
  contentInput.value = note ? note.content : "";
  noteModal.classList.remove("hidden");
  titleInput.focus();
}
function closeModal() { noteModal.classList.add("hidden"); noteForm.reset(); editingId = null; }
async function saveNote(event) {
  event.preventDefault();
  const payload = {title:titleInput.value.trim(), content:contentInput.value.trim()};
  if (!payload.title || !payload.content) return showToast("Please complete both fields.");
  const url = editingId ? `/api/notes/${editingId}` : "/api/notes";
  const method = editingId ? "PUT" : "POST";
  try {
    const response = await fetch(url, {method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload)});
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not save note");
    closeModal();
    await loadNotes();
    showToast(editingId ? "Note updated successfully." : "Note saved successfully.");
  } catch (error) { showToast(error.message); }
}
window.editNote = id => {
  const note = notes.find(item => item.id === id);
  if (note) openModal(note);
};
window.deleteNote = async id => {
  if (!confirm("Are you sure you want to delete this note?")) return;
  try {
    const response = await fetch(`/api/notes/${id}`, {method:"DELETE"});
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not delete note");
    await loadNotes();
    showToast("Note deleted.");
  } catch (error) { showToast(error.message); }
};
document.getElementById("newNoteButton").addEventListener("click", () => openModal());
document.getElementById("emptyNewButton").addEventListener("click", () => openModal());
document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("allNotesButton").addEventListener("click", () => {searchInput.value = ""; renderNotes();});
searchInput.addEventListener("input", renderNotes);
noteForm.addEventListener("submit", saveNote);
noteModal.addEventListener("click", event => {if (event.target === noteModal) closeModal();});
document.addEventListener("keydown", event => {if (event.key === "Escape" && !noteModal.classList.contains("hidden")) closeModal();});
loadNotes();
