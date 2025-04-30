import AddStationForm from "./AddStationForm";
import StationList from "./StationList";
export default function AddStationPage() {
    return (
        <main className="flex flex-col justify-center items-center m-5">
            <h1 className="text-2xl">Добавить станцию</h1>
            <AddStationForm />
            <StationList />
        </main>
    );
}
