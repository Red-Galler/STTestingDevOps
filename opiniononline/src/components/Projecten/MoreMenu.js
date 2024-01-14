import { Button, Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react";
import IconButton from "../IconButton";
import { FaEllipsisH } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DuplicateProjectModal from "./DuplicateProjectModal";
import DetailsDrawer from "./DetailsDrawer";

function MoreMenu({ survey, onEditTitle, onDuplicate, onOpenDetails, onChangeStatus, onRemoveMarked, onOpenInNewTab, onDelete, isSurveyMarked, onShare }) {
    const navigate = useNavigate();

    return (

        <div className="relative">


            <Menu className={"!ms-3"} placement="right" lockScroll={true}>
                <MenuHandler>
                    <button className="z-10 hover:bg-gray-normal dark:hover:bg-gray-600 text-gray-darker  p-2 rounded-md">
                        <FaEllipsisH />
                    </button>
                </MenuHandler>
                <MenuList className="dark:bg-dark-secondary dark:border-dark-border">
                    <MenuItem className="dark:text-gray-200" onClick={() => navigate(`/Editor/${survey.id}`)}>Openen</MenuItem>
                    <MenuItem className="dark:text-gray-200" onClick={onEditTitle}>Naam wijzigen</MenuItem>
                    <MenuItem className="dark:text-gray-200" onClick={onDuplicate}>Dupliceren</MenuItem>
                    <MenuItem className="dark:text-gray-200" onClick={onOpenDetails}>Details weergeven</MenuItem>
                    <MenuItem className="dark:text-gray-200" onClick={(e) => { e.stopPropagation(); onChangeStatus() }}>Status wijzigen</MenuItem>
                    <MenuItem className="dark:text-gray-200" onClick={onShare}>Delen</MenuItem>
                    <MenuItem className="dark:text-gray-200" onClick={onRemoveMarked} disabled={!isSurveyMarked}>Verwijderen uit items met ster</MenuItem>
                    <MenuItem className="dark:text-gray-200" onClick={onOpenInNewTab}>Openen in nieuw tabblad</MenuItem>
                    <MenuItem className="text-red-400 dark:text-red-500" onClick={onDelete}>Verwijderen</MenuItem>

                </MenuList>


            </Menu>

        </div>

    )
}


export default MoreMenu;